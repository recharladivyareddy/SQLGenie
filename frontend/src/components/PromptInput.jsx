// import React, { useState, FormEvent } from 'react';
// import { Send } from 'lucide-react';

// const PromptInput = ({ onSendMessage, disabled = false }) => {
//   const [input, setInput] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (input.trim() && !disabled) {
//       onSendMessage(input);
//       setInput('');
//     }
//   };

//   return (
//     <div className="border-t border-gray-200 bg-white p-4">
//       <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
//         <div className="relative">
//           <textarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Message SQLGenie..."
//             className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
//             rows={1}
//             disabled={disabled}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSubmit(e);
//               }
//             }}
//           />
//           <button
//             type="submit"
//             disabled={disabled || !input.trim()}
//             className={`absolute right-3 bottom-3 p-1 rounded-md ${
//               disabled || !input.trim() ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             <Send size={18} />
//           </button>
//         </div>
      
//       </form>
//     </div>
//   );
// };

// export default PromptInput;

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
      <form onSubmit={handleSubmit} className="mx-auto space-y-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="w-full h-12 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
          rows={2}
          disabled={disabled}
        />
        <textarea
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          placeholder="Schema"
          className="w-full h-12 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
          rows={2}
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
            Generate SQL
          </div>
        </button>
      </form>
    </div>
  );
};

export default PromptInput;
