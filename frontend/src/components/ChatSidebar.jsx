import { PlusCircle, MessageSquare } from 'lucide-react';

const ChatSidebar = ({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onDeleteChat,
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
          <div
            key={chat.id}
            className={`flex items-center justify-between p-2 rounded-md transition-colors ${
              activeChat?.id === chat.id ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <button
              onClick={() => onChatSelect(chat)}
              className="flex items-center gap-2 text-left w-full truncate"
            >
              <MessageSquare size={16} />
              <span className="truncate">{chat.title}</span>
            </button>
            <button
              onClick={() => onDeleteChat(chat.id)}
              className="ml-2 text-gray-400 hover:text-red-500"
              title="Delete chat"
            >
              ✕
            </button>
          </div>
        ))}

                  
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;