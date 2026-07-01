import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { FiLoader } from 'react-icons/fi';

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

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-center">
            <FiLoader className="animate-spin text-blue-500" size={24} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-white">
        <label className="flex items-center mb-2 text-sm">
          <input
            type="checkbox"
            checked={useRAG}
            onChange={(e) => setUseRAG(e.target.checked)}
            className="mr-2"
          />
          Use Knowledge Base (RAG)
        </label>
        <InputArea onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatWindow;
