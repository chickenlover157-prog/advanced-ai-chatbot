import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { FiLoader, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

const ChatWindow: React.FC<{ conversationId: string }> = ({ conversationId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [useRAG, setUseRAG] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token } = useStore();

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/conversations/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/chat/conversations/${conversationId}/messages`,
        { content, useRAG },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        ...prev,
        { role: 'user', content, timestamp: new Date() },
        { role: 'assistant', content: response.data.message, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = async () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h2 className="text-lg font-bold">💬 Chat Window</h2>
        <button
          onClick={clearMessages}
          className="btn-icon text-white hover:bg-blue-700 transition-colors"
          title="Clear messages"
        >
          <FiTrash2 size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">👋</div>
              <p className="text-gray-500 text-lg">Start a conversation...</p>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className="animate-fade-in">
            <MessageBubble message={msg} />
          </div>
        ))}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin">
              <FiLoader className="text-blue-500" size={32} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer with RAG Toggle */}
      <div className="border-t border-gray-200 p-6 bg-white shadow-lg">
        <div className="mb-4">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={useRAG}
              onChange={(e) => setUseRAG(e.target.checked)}
              className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              🔍 Use Knowledge Base (RAG)
            </span>
          </label>
        </div>
        <InputArea onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatWindow;
