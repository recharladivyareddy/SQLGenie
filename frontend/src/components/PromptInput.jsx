import React, { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';

const PromptInput = ({ onSendMessage, disabled = false }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message SQLGenie..."
            className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
            rows={1}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className={`absolute right-3 bottom-3 p-1 rounded-md ${
              disabled || !input.trim() ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      
      </form>
    </div>
  );
};

export default PromptInput;