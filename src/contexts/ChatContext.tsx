'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { getSocketClient, SocketClient } from '@/lib/socket-client';
import { ChatMessage, ChatRoom, TypingIndicator } from '@/lib/socket-server';

interface ChatContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  
  // Chat rooms
  rooms: ChatRoom[];
  activeRoomId: number | null;
  
  // Messages
  messages: Record<number, ChatMessage[]>;
  
  // Typing indicators
  typingUsers: Record<number, TypingIndicator[]>;
  
  // Methods
  connect: (token: string) => void;
  disconnect: () => void;
  joinRoom: (roomId: number) => void;
  leaveRoom: (roomId: number) => void;
  sendMessage: (roomId: number, message: string) => void;
  createRoom: (name: string, type: 'direct' | 'group', participants: number[]) => void;
  markMessagesRead: (roomId: number, messageIds: number[]) => void;
  startTyping: (roomId: number) => void;
  stopTyping: (roomId: number) => void;
  setActiveRoom: (roomId: number | null) => void;
  getUserRooms: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [socketClient] = useState<SocketClient>(() => getSocketClient());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
  const [typingUsers, setTypingUsers] = useState<Record<number, TypingIndicator[]>>({});

  // Connection methods
  const connect = useCallback((token: string) => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    socketClient.connect(token);
  }, [socketClient, isConnected, isConnecting]);

  const disconnect = useCallback(() => {
    socketClient.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
  }, [socketClient]);

  // Room methods
  const joinRoom = useCallback((roomId: number) => {
    socketClient.joinRoom(roomId);
  }, [socketClient]);

  const leaveRoom = useCallback((roomId: number) => {
    socketClient.leaveRoom(roomId);
    // Remove messages for this room to free memory
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[roomId];
      return newMessages;
    });
  }, [socketClient]);

  const setActiveRoom = useCallback((roomId: number | null) => {
    // Leave previous room
    if (activeRoomId && activeRoomId !== roomId) {
      leaveRoom(activeRoomId);
    }
    
    setActiveRoomId(roomId);
    
    // Join new room
    if (roomId) {
      joinRoom(roomId);
    }
  }, [activeRoomId, joinRoom, leaveRoom]);

  // Message methods
  const sendMessage = useCallback((roomId: number, message: string) => {
    socketClient.sendMessage(roomId, message);
  }, [socketClient]);

  const markMessagesRead = useCallback((roomId: number, messageIds: number[]) => {
    socketClient.markMessagesRead(roomId, messageIds);
  }, [socketClient]);

  // Typing methods
  const startTyping = useCallback((roomId: number) => {
    socketClient.startTyping(roomId);
  }, [socketClient]);

  const stopTyping = useCallback((roomId: number) => {
    socketClient.stopTyping(roomId);
  }, [socketClient]);

  // Room management
  const createRoom = useCallback((name: string, type: 'direct' | 'group', participants: number[]) => {
    socketClient.createRoom(name, type, participants);
  }, [socketClient]);

  const getUserRooms = useCallback(() => {
    socketClient.getUserRooms();
  }, [socketClient]);

  // Socket event handlers
  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      setIsConnecting(false);
      // Load user rooms on connect
      socketClient.getUserRooms();
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    const handleNewMessage = (message: ChatMessage) => {
      setMessages(prev => ({
        ...prev,
        [message.chat_room_id]: [
          ...(prev[message.chat_room_id] || []),
          message
        ]
      }));

      // Update room's last message
      setRooms(prev => prev.map(room => 
        room.id === message.chat_room_id 
          ? { ...room, last_message: message }
          : room
      ));
    };

    const handleRoomMessages = (data: { roomId: number; messages: ChatMessage[] }) => {
      setMessages(prev => ({
        ...prev,
        [data.roomId]: data.messages
      }));
    };

    const handleUserRooms = (userRooms: ChatRoom[]) => {
      setRooms(userRooms);
    };

    const handleNewRoom = (room: ChatRoom) => {
      setRooms(prev => [room, ...prev]);
    };

    const handleUserTyping = (data: TypingIndicator) => {
      setTypingUsers(prev => {
        const roomTypingUsers = prev[data.room_id] || [];
        
        if (data.is_typing) {
          // Add user to typing list if not already there
          const existingIndex = roomTypingUsers.findIndex(u => u.user_id === data.user_id);
          if (existingIndex === -1) {
            return {
              ...prev,
              [data.room_id]: [...roomTypingUsers, data]
            };
          }
        } else {
          // Remove user from typing list
          return {
            ...prev,
            [data.room_id]: roomTypingUsers.filter(u => u.user_id !== data.user_id)
          };
        }
        
        return prev;
      });
    };

    const handleMessagesRead = (data: { userId: number; messageIds: number[] }) => {
      // Update read status for messages
      setMessages(prev => {
        const newMessages = { ...prev };
        Object.keys(newMessages).forEach(roomId => {
          newMessages[parseInt(roomId)] = newMessages[parseInt(roomId)].map(msg =>
            data.messageIds.includes(msg.id)
              ? { ...msg, is_read: true }
              : msg
          );
        });
        return newMessages;
      });
    };

    const handleError = (error: { message: string }) => {
      console.error('Chat error:', error.message);
      // You can add toast notifications here
    };

    // Register event listeners
    socketClient.on('connected', handleConnected);
    socketClient.on('disconnected', handleDisconnected);
    socketClient.on('new_message', handleNewMessage);
    socketClient.on('room_messages', handleRoomMessages);
    socketClient.on('user_rooms', handleUserRooms);
    socketClient.on('new_room', handleNewRoom);
    socketClient.on('user_typing', handleUserTyping);
    socketClient.on('messages_read', handleMessagesRead);
    socketClient.on('error', handleError);

    // Cleanup
    return () => {
      socketClient.off('connected', handleConnected);
      socketClient.off('disconnected', handleDisconnected);
      socketClient.off('new_message', handleNewMessage);
      socketClient.off('room_messages', handleRoomMessages);
      socketClient.off('user_rooms', handleUserRooms);
      socketClient.off('new_room', handleNewRoom);
      socketClient.off('user_typing', handleUserTyping);
      socketClient.off('messages_read', handleMessagesRead);
      socketClient.off('error', handleError);
    };
  }, [socketClient]);

  const value: ChatContextType = {
    isConnected,
    isConnecting,
    rooms,
    activeRoomId,
    messages,
    typingUsers,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    createRoom,
    markMessagesRead,
    startTyping,
    stopTyping,
    setActiveRoom,
    getUserRooms,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}