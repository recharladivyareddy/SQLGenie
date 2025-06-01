import React, { useState } from 'react';
import { Send } from 'lucide-react';

const PromptInput = ({ onSendMessage, disabled = false }) => {
  const [question, setQuestion] = useState('');
  const [schema, setSchema] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && schema.trim() && !disabled) {
      onSendMessage({ question, schema });
      setQuestion('');
      setSchema('');
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
          rows={1}
          disabled={disabled}
        />
        <textarea
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          placeholder="Schema"
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
          rows={1}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !question.trim() || !schema.trim()}
          className={`px-4 py-2 rounded-md ${
            disabled || !question.trim() || !schema.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-800 text-white hover:bg-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Send size={18} />
            Generate query
          </div>
        </button>
      </form>
    </div>
  );
};

export default PromptInput;
