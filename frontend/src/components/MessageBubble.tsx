import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

interface MessageBubbleProps {
  message: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: Date;
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
        }`}
      >
        {isUser ? (
          <p className="text-sm sm:text-base">{message.content}</p>
        ) : (
          <>
            <ReactMarkdown
              components={{
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="my-2 rounded-lg overflow-hidden">
                      <SyntaxHighlighter style={atomDark} language={match[1]} {...props}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-gray-200 px-2 py-1 rounded font-mono text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            <button
              onClick={handleCopy}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              {copied ? (
                <>
                  <FiCheck size={14} /> Copied!
                </>
              ) : (
                <>
                  <FiCopy size={14} /> Copy
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
