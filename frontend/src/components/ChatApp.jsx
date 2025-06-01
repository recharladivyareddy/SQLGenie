import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar.jsx';
import ChatContainer from './ChatContainer.jsx';
import { sendMessage, createNewChat } from '../utils/api.js';
import  '../index.css'
function ChatApp() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with a new chat
    handleNewChat();
  }, []);

  const handleDeleteChat = (chatId) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));

    if (activeChat?.id === chatId) {
      setActiveChat(null); // Optionally clear if deleted chat was active
    }
  };

  const handleNewChat = async () => {
    try {
      const newChat = await createNewChat();
      setChats(prevChats => [newChat, ...prevChats]);
      setActiveChat(newChat);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const handleSendMessage = async ({ question, schema }) => {
    const content = `Question: ${question}\nSchema: ${schema}`;

    // Create user message
    const userMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    // If no active chat, create one
    if (!activeChat) {
      const newChat = await createNewChat();
      newChat.messages = [userMessage];
      newChat.title = content.slice(10, 60) + (content.length > 30 ? '...' : '');
      
      setChats(prevChats => [newChat, ...prevChats]);
      setActiveChat(newChat);
    } else {
      // Update active chat with user message
      const updatedChat = {
        ...activeChat,
        messages: [...activeChat.messages, userMessage],
        updatedAt: new Date(),
      };
      
      // If this is the first message, set the chat title
      if (activeChat.messages.length === 0) {
        updatedChat.title = content.slice(10, 60) + (content.length > 30 ? '...' : '');
      }
      
      setActiveChat(updatedChat);
      setChats(prevChats => 
        prevChats.map(chat => chat.id === updatedChat.id ? updatedChat : chat)
      );
    }

    // Get response from API
    setIsLoading(true);
    try {
      const assistantMessage = await sendMessage({ question, schema }, activeChat?.id);
      
      // Update chat with assistant response
      const chatToUpdate = activeChat || chats[0];
      const updatedChat = {
        ...chatToUpdate,
        messages: [...chatToUpdate.messages, userMessage, assistantMessage],
        updatedAt: new Date(),
        title: chatToUpdate.title === 'New conversation'
          ? content.slice(10, 60) + (content.length > 30 ? '...' : '')
          : chatToUpdate.title,
      };
      
      setActiveChat(updatedChat);
      setChats(prevChats => 
        prevChats.map(chat => chat.id === updatedChat.id ? updatedChat : chat)
      );
    } catch (error) {
      console.error('Failed to get response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
  };

  return (
    <div className="chat-app">
      <ChatSidebar 
        chats={chats} 
        activeChat={activeChat} 
        onChatSelect={handleChatSelect} 
        onNewChat={handleNewChat} 
        onDeleteChat={handleDeleteChat}
      />
      <ChatContainer 
        activeChat={activeChat} 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
}

export default ChatApp;