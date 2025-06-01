import React from 'react';
import { PlusCircle, MessageSquare, Settings, LogOut } from 'lucide-react';

const ChatSidebar = ({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
}) => {
  return (
    <div className="flex flex-col bg-gray-900 text-white w-64 p-2">
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 transition-colors border border-gray-700 mb-2"
      >
        <PlusCircle size={16} />
        <span>New chat</span>
      </button>

      <div className="flex-1 overflow-auto">
        <div className="space-y-1 mt-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`flex items-center gap-2 p-3 w-full text-left rounded-md hover:bg-gray-700 transition-colors ${
                activeChat?.id === chat.id ? 'bg-gray-700' : ''
              }`}
            >
              <MessageSquare size={16} />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-700 pt-2 space-y-1">
        <button className="flex items-center gap-2 p-3 w-full text-left rounded-md hover:bg-gray-700 transition-colors">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;