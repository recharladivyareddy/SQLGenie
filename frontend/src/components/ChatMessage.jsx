import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`py-5 ${isUser ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="max-w-3xl mx-auto flex gap-4 px-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gray-300' : 'bg-blue-500'}`}>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">{isUser ? 'You' : 'Response'}</p>
          <div className="prose prose-sm">{message.content}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;