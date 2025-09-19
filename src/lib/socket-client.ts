'use client';

import { io, Socket } from 'socket.io-client';
import { ChatMessage, ChatRoom, TypingIndicator } from './socket-server';

export class SocketClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    // Initialize listeners map
    this.listeners.set('connected', []);
    this.listeners.set('disconnected', []);
    this.listeners.set('new_message', []);
    this.listeners.set('user_typing', []);
    this.listeners.set('room_messages', []);
    this.listeners.set('user_rooms', []);
    this.listeners.set('new_room', []);
    this.listeners.set('user_joined', []);
    this.listeners.set('user_left', []);
    this.listeners.set('messages_read', []);
    this.listeners.set('error', []);
  }

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.token = token;
    
    this.socket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000', {
      path: '/api/socketio',
      auth: { token },
      autoConnect: true,
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.emit('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.emit('disconnected');
    });

    this.socket.on('new_message', (message: ChatMessage) => {
      this.emit('new_message', message);
    });

    this.socket.on('user_typing', (data: TypingIndicator) => {
      this.emit('user_typing', data);
    });

    this.socket.on('room_messages', (data: { roomId: number; messages: ChatMessage[] }) => {
      this.emit('room_messages', data);
    });

    this.socket.on('user_rooms', (rooms: ChatRoom[]) => {
      this.emit('user_rooms', rooms);
    });

    this.socket.on('new_room', (room: ChatRoom) => {
      this.emit('new_room', room);
    });

    this.socket.on('user_joined', (data: { userId: number; name: string; role: string }) => {
      this.emit('user_joined', data);
    });

    this.socket.on('user_left', (data: { userId: number; name: string }) => {
      this.emit('user_left', data);
    });

    this.socket.on('messages_read', (data: { userId: number; messageIds: number[] }) => {
      this.emit('messages_read', data);
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });
  }

  // Event emitter methods
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Chat methods
  joinRoom(roomId: number) {
    if (this.socket?.connected) {
      this.socket.emit('join_room', roomId);
    }
  }

  leaveRoom(roomId: number) {
    if (this.socket?.connected) {
      this.socket.emit('leave_room', roomId);
    }
  }

  sendMessage(roomId: number, message: string, messageType: 'text' | 'file' | 'image' = 'text', fileUrl?: string) {
    if (this.socket?.connected) {
      this.socket.emit('send_message', {
        roomId,
        message,
        messageType,
        fileUrl
      });
    }
  }

  startTyping(roomId: number) {
    if (this.socket?.connected) {
      this.socket.emit('typing_start', roomId);
    }
  }

  stopTyping(roomId: number) {
    if (this.socket?.connected) {
      this.socket.emit('typing_stop', roomId);
    }
  }

  markMessagesRead(roomId: number, messageIds: number[]) {
    if (this.socket?.connected) {
      this.socket.emit('mark_messages_read', { roomId, messageIds });
    }
  }

  getUserRooms() {
    if (this.socket?.connected) {
      this.socket.emit('get_user_rooms');
    }
  }

  createRoom(name: string, type: 'direct' | 'group', participants: number[]) {
    if (this.socket?.connected) {
      this.socket.emit('create_room', { name, type, participants });
    }
  }

  get isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Singleton instance
let socketClient: SocketClient | null = null;

export function getSocketClient(): SocketClient {
  if (!socketClient) {
    socketClient = new SocketClient();
  }
  return socketClient;
}