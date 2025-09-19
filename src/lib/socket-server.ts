import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { verifyToken } from './auth';
import { executeQuery } from './database';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export interface ChatMessage {
  id: number;
  chat_room_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  message: string;
  message_type: 'text' | 'file' | 'image';
  file_url?: string;
  created_at: string;
  is_read: boolean;
}

export interface TypingIndicator {
  room_id: number;
  user_id: number;
  user_name: string;
  is_typing: boolean;
}

export interface ChatRoom {
  id: number;
  name: string;
  type: 'direct' | 'group';
  participants: number[];
  created_at: string;
  last_message?: ChatMessage;
}

export const initSocketServer = (httpServer: NetServer) => {
  const io = new SocketIOServer(httpServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = await verifyToken(token);
      if (!decoded) {
        return next(new Error('Authentication error: Invalid token'));
      }

      // Attach user info to socket
      socket.data = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      };

      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.name} (${socket.data.role})`);

    // Join user to their personal room for notifications
    socket.join(`user_${socket.data.userId}`);

    // Handle joining chat rooms
    socket.on('join_room', async (roomId: number) => {
      try {
        // Verify user has access to this room
        const hasAccess = await verifyRoomAccess(socket.data.userId, roomId);
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied to this chat room' });
          return;
        }

        socket.join(roomId);
        
        // Load recent messages for the room
        const messages = await getChatMessages(roomId, 50);
        socket.emit('room_messages', { roomId, messages });

        // Notify others in room that user joined
        socket.to(roomId).emit('user_joined', {
          userId: socket.data.userId,
          name: socket.data.name,
          role: socket.data.role
        });

        console.log(`${socket.data.name} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle leaving chat rooms
    socket.on('leave_room', (roomId: number) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user_left', {
        userId: socket.data.userId,
        name: socket.data.name
      });
      console.log(`${socket.data.name} left room ${roomId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data: {
      roomId: number;
      message: string;
      messageType?: 'text' | 'file' | 'image';
      fileUrl?: string;
    }) => {
      try {
        // Verify user has access to this room
        const hasAccess = await verifyRoomAccess(socket.data.userId, data.roomId);
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied to send message to this room' });
          return;
        }

        // Save message to database
        const messageData = await saveMessage({
          chat_room_id: data.roomId,
          sender_id: socket.data.userId,
          message: data.message,
          message_type: data.messageType || 'text',
          file_url: data.fileUrl
        });

        // Broadcast message to all users in the room
        const fullMessage: ChatMessage = {
          ...messageData,
          sender_name: socket.data.name,
          sender_role: socket.data.role
        };

        io.to(data.roomId).emit('new_message', fullMessage);

        // Update room's last message
        await updateRoomLastMessage(data.roomId, messageData.id);

        console.log(`Message sent in room ${data.roomId} by ${socket.data.name}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (roomId: number) => {
      socket.to(roomId).emit('user_typing', {
        userId: socket.data.userId,
        name: socket.data.name,
        isTyping: true
      });
    });

    socket.on('typing_stop', (roomId: number) => {
      socket.to(roomId).emit('user_typing', {
        userId: socket.data.userId,
        name: socket.data.name,
        isTyping: false
      });
    });

    // Handle message read receipts
    socket.on('mark_messages_read', async (data: { roomId: number, messageIds: number[] }) => {
      try {
        await markMessagesAsRead(data.messageIds, socket.data.userId);
        
        // Notify other users in room about read receipts
        socket.to(data.roomId).emit('messages_read', {
          userId: socket.data.userId,
          messageIds: data.messageIds
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle getting user's chat rooms
    socket.on('get_user_rooms', async () => {
      try {
        const rooms = await getUserChatRooms(socket.data.userId);
        socket.emit('user_rooms', rooms);
      } catch (error) {
        console.error('Error getting user rooms:', error);
        socket.emit('error', { message: 'Failed to load chat rooms' });
      }
    });

    // Handle creating new chat room
    socket.on('create_room', async (data: {
      name: string;
      type: 'direct' | 'group';
      participants: number[];
    }) => {
      try {
        // Add current user to participants if not already included
        if (!data.participants.includes(socket.data.userId)) {
          data.participants.push(socket.data.userId);
        }

        const room = await createChatRoom({
          name: data.name,
          type: data.type,
          creator_id: socket.data.userId,
          participants: data.participants
        });

        // Join all participants to the room
        data.participants.forEach(participantId => {
          io.to(`user_${participantId}`).emit('new_room', room);
        });

        console.log(`New ${data.type} room created: ${data.name} by ${socket.data.name}`);
      } catch (error) {
        console.error('Error creating room:', error);
        socket.emit('error', { message: 'Failed to create chat room' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.name}`);
    });
  });

  return io;
};

// Database helper functions
async function verifyRoomAccess(userId: number, roomId: number): Promise<boolean> {
  try {
    const result = await executeQuery(
      `SELECT COUNT(*) as count FROM chat_room_participants 
       WHERE room_id = ? AND user_id = ?`,
      [roomId, userId]
    );
    return result[0]?.count > 0;
  } catch (error) {
    console.error('Error verifying room access:', error);
    return false;
  }
}

async function getChatMessages(roomId: number, limit: number = 50): Promise<ChatMessage[]> {
  try {
    const messages = await executeQuery(
      `SELECT m.*, CONCAT(u.first_name, ' ', u.last_name) as sender_name, u.role as sender_role
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.chat_room_id = ?
       ORDER BY m.created_at DESC
       LIMIT ?`,
      [roomId, limit]
    );
    return messages.reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error getting chat messages:', error);
    return [];
  }
}

async function saveMessage(messageData: {
  chat_room_id: number;
  sender_id: number;
  message: string;
  message_type: string;
  file_url?: string;
}) {
  try {
    const result = await executeQuery(
      `INSERT INTO messages (chat_room_id, sender_id, message, message_type, file_url, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [messageData.chat_room_id, messageData.sender_id, messageData.message, messageData.message_type, messageData.file_url || null]
    );

    const [savedMessage] = await executeQuery(
      `SELECT * FROM messages WHERE id = ?`,
      [result.insertId]
    );

    return savedMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

async function updateRoomLastMessage(roomId: number, messageId: number) {
  try {
    await executeQuery(
      `UPDATE chat_rooms SET last_message_id = ?, updated_at = NOW() WHERE id = ?`,
      [messageId, roomId]
    );
  } catch (error) {
    console.error('Error updating room last message:', error);
  }
}

async function markMessagesAsRead(messageIds: number[], userId: number) {
  try {
    if (messageIds.length === 0) return;
    
    const placeholders = messageIds.map(() => '?').join(',');
    await executeQuery(
      `INSERT IGNORE INTO message_reads (message_id, user_id, read_at)
       VALUES ${messageIds.map(() => '(?, ?, NOW())').join(', ')}`,
      messageIds.flatMap(id => [id, userId])
    );
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}

async function getUserChatRooms(userId: number): Promise<ChatRoom[]> {
  try {
    const rooms = await executeQuery(
      `SELECT DISTINCT cr.*, m.message as last_message, m.created_at as last_message_time
       FROM chat_rooms cr
       JOIN chat_room_participants crp ON cr.id = crp.room_id
       LEFT JOIN messages m ON cr.last_message_id = m.id
       WHERE crp.user_id = ?
       ORDER BY cr.updated_at DESC`,
      [userId]
    );

    return rooms;
  } catch (error) {
    console.error('Error getting user chat rooms:', error);
    return [];
  }
}

async function createChatRoom(roomData: {
  name: string;
  type: 'direct' | 'group';
  creator_id: number;
  participants: number[];
}) {
  try {
    // Create room
    const result = await executeQuery(
      `INSERT INTO chat_rooms (name, type, creator_id, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [roomData.name, roomData.type, roomData.creator_id]
    );
    
    const roomId = result.insertId;

    // Add participants
    for (const participantId of roomData.participants) {
      await executeQuery(
        `INSERT INTO chat_room_participants (room_id, user_id, joined_at)
         VALUES (?, ?, NOW())`,
        [roomId, participantId]
      );
    }

    const [room] = await executeQuery(
      `SELECT * FROM chat_rooms WHERE id = ?`,
      [roomId]
    );

    return room;
  } catch (error) {
    console.error('Error creating chat room:', error);
    throw error;
  }
}