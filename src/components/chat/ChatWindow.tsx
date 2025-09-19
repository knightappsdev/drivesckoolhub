'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  EllipsisVerticalIcon,
  UserPlusIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useChat } from '@/contexts/ChatContext';
import { ChatMessage } from '@/lib/socket-server';
import { format } from 'date-fns';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function ChatWindow({ isOpen, onClose, className = '' }: ChatWindowProps) {
  const {
    isConnected,
    rooms,
    activeRoomId,
    messages,
    typingUsers,
    setActiveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    markMessagesRead
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const activeRoom = rooms.find(room => room.id === activeRoomId);
  const activeMessages = activeRoomId ? messages[activeRoomId] || [] : [];
  const activeTypingUsers = activeRoomId ? typingUsers[activeRoomId] || [] : [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, activeTypingUsers]);

  // Handle typing indicators
  const handleInputChange = (value: string) => {
    setMessageInput(value);

    if (activeRoomId && value.length > 0 && !isTyping) {
      setIsTyping(true);
      startTyping(activeRoomId);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (activeRoomId && isTyping) {
        setIsTyping(false);
        stopTyping(activeRoomId);
      }
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeRoomId) return;

    sendMessage(activeRoomId, messageInput.trim());
    setMessageInput('');
    
    // Stop typing
    if (isTyping) {
      setIsTyping(false);
      stopTyping(activeRoomId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className={`fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">
                {activeRoom ? activeRoom.name : 'DriveSchool Chat'}
              </h3>
              <p className="text-sm opacity-90">
                {isConnected ? 'Connected' : 'Connecting...'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {activeRoom && (
              <button className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <EllipsisVerticalIcon className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-4rem)]">
        {/* Room List */}
        <div className="w-32 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-2 space-y-1">
            {rooms.map((room) => (
              <motion.button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`w-full p-2 rounded-lg text-left text-sm transition-colors ${
                  activeRoomId === room.id 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-medium truncate">{room.name}</div>
                {room.last_message && (
                  <div className="text-xs text-gray-500 truncate mt-1">
                    {room.last_message.message}
                  </div>
                )}
              </motion.button>
            ))}
            
            {rooms.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-4">
                <ChatBubbleLeftRightIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No chats yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeRoom ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {activeMessages.map((message, index) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </AnimatePresence>

                {/* Typing Indicators */}
                {activeTypingUsers.length > 0 && (
                  <motion.div
                    className="flex items-center space-x-2 text-gray-500 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    </div>
                    <span>
                      {activeTypingUsers.map(u => u.user_name).join(', ')} 
                      {activeTypingUsers.length === 1 ? ' is' : ' are'} typing...
                    </span>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                      disabled={!isConnected}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || !isConnected}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No Room Selected */
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Select a chat</h3>
                <p className="text-sm">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Message Bubble Component
function MessageBubble({ message }: { message: ChatMessage }) {
  const isOwnMessage = false; // You'll need to determine this based on current user

  return (
    <motion.div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {!isOwnMessage && (
          <div className="text-xs font-medium text-gray-600 mb-1">
            {message.sender_name}
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm">{message.message}</p>
          <div
            className={`text-xs mt-1 ${
              isOwnMessage ? 'text-blue-200' : 'text-gray-500'
            }`}
          >
            {format(new Date(message.created_at), 'HH:mm')}
          </div>
        </div>
      </div>
    </motion.div>
  );
}