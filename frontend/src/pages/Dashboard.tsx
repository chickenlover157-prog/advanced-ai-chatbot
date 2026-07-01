import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';
import ChatWindow from '../components/ChatWindow';
import TestingTab from '../components/TestingTab';
import { FiPlus, FiSettings, FiLogOut, FiBeaker } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'testing'>('chat');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const { token, user, logout } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchConversations();
    fetchAnalytics();
  }, [token]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(response.data);
      if (!selectedConversation && response.data.length > 0) {
        setSelectedConversation(response.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat/conversations',
        { title: `Conversation ${new Date().toLocaleTimeString()}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversations((prev) => [response.data, ...prev]);
      setSelectedConversation(response.data._id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">ChatBot AI</h1>
          <p className="text-sm text-gray-500">{user?.name}</p>
        </div>

        <button
          onClick={createNewConversation}
          className="m-4 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FiPlus /> New Chat
        </button>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv._id}
              onClick={() => setSelectedConversation(conv._id)}
              className={`w-full text-left px-4 py-2 border-b border-gray-100 hover:bg-gray-50 transition ${
                selectedConversation === conv._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <p className="text-sm font-medium text-gray-800 truncate">{conv.title}</p>
              <p className="text-xs text-gray-500">Messages: {conv.messages.length}</p>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded transition"
          >
            <FiSettings /> Analytics
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === 'testing'
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiBeaker /> Testing
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-4">
          {activeTab === 'chat' && selectedConversation && (
            <ChatWindow conversationId={selectedConversation} />
          )}
          {activeTab === 'testing' && <TestingTab />}
        </div>

        {/* Analytics Modal */}
        {showAnalytics && analytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Your Analytics</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Total Tokens:</strong> {analytics.totalTokens.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Messages Sent:</strong> {analytics.messagesCount}
                </p>
                <p className="text-gray-700">
                  <strong>Avg Tokens/Message:</strong> {analytics.averageTokensPerMessage}
                </p>
              </div>
              <button
                onClick={() => setShowAnalytics(false)}
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
