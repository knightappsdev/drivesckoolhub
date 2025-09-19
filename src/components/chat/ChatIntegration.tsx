'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, BellIcon } from '@heroicons/react/24/outline';
import { useChat } from '@/contexts/ChatContext';
import ChatWindow from './ChatWindow';

interface ChatIntegrationProps {
  token?: string;
}

export default function ChatIntegration({ token }: ChatIntegrationProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isConnected, connect, rooms, messages } = useChat();

  // Auto-connect when component mounts with token
  useEffect(() => {
    if (token && !isConnected) {
      connect(token);
    }
  }, [token, isConnected, connect]);

  // Calculate unread messages count
  const unreadCount = rooms.reduce((total, room) => {
    const roomMessages = messages[room.id] || [];
    const unreadMessages = roomMessages.filter(msg => !msg.is_read);
    return total + unreadMessages.length;
  }, 0);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (!token) return null;

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-20 right-4 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <motion.button
          onClick={toggleChat}
          className="relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ 
            y: [0, -4, 0],
          }}
          transition={{ 
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
          
          {/* Unread Messages Badge */}
          {unreadCount > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}

          {/* Connection Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />

          {/* Pulse Effect for New Messages */}
          {unreadCount > 0 && (
            <motion.div
              className="absolute inset-0 bg-blue-400 rounded-full"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.button>

        {/* Tooltip */}
        {!isChatOpen && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            💬 Team Chat
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-xs rounded-full">
                {unreadCount}
              </span>
            )}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
          </motion.div>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <ChatWindow 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Chat Notification Toast */}
      <AnimatePresence>
        {!isChatOpen && unreadCount > 0 && (
          <motion.div
            className="fixed bottom-36 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm z-30"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <BellIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">New Messages</h4>
                <p className="text-sm text-gray-600 mt-1">
                  You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={toggleChat}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Open Chat
                </button>
              </div>
              <button
                onClick={() => {/* You can implement dismiss functionality */}}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}