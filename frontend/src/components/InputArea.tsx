import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

interface InputAreaProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3" aria-label="Send message form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Type your message..."
        disabled={disabled}
        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
          isFocused
            ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
            : 'border-gray-300 hover:border-gray-400'
        } disabled:bg-gray-100 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 text-gray-900 placeholder-gray-500 text-base min-h-12`}
        aria-label="Message input"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="btn-primary flex items-center justify-center gap-2 min-w-max px-4"
        aria-label={disabled ? 'Sending message' : 'Send message'}
      >
        <FiSend size={20} aria-hidden="true" />
        <span className="hidden sm:inline">Send</span>
      </button>
    </form>
  );
};

export default InputArea;
