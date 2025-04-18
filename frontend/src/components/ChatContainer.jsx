import React from 'react';
import ChatMessage from './ChatMessage.jsx';
import PromptInput from './PromptInput.jsx';

const ChatContainer = ({
  activeChat,
  onSendMessage,
  isLoading,
}) => {
  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-bold mb-2">SQLGenie</h1>
        <p className="text-gray-500 mb-8">How can I help you today?</p>
        <PromptInput onSendMessage={onSendMessage} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {activeChat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Start a conversation by sending a message below.</p>
          </div>
        ) : (
          activeChat.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
      <PromptInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatContainer;