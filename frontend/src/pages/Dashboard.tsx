import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';
import ChatWindow from '../components/ChatWindow';
import TestingTab from '../components/TestingTab';
import { FiPlus, FiSettings, FiLogOut, FiBeaker, FiMenu, FiX, FiBarChart3 } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'testing'>('chat');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
        { title: `Chat ${new Date().toLocaleTimeString()}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversations((prev) => [response.data, ...prev]);
      setSelectedConversation(response.data._id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Sign out?')) {
      logout();
      navigate('/login');
    }
  };

  const deleteConversation = async (convId: string) => {
    if (window.confirm('Delete this conversation?')) {
      try {
        await axios.delete(`http://localhost:5000/api/chat/conversations/${convId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations((prev) => prev.filter((c) => c._id !== convId));
        if (selectedConversation === convId) {
          setSelectedConversation(conversations.length > 1 ? conversations[1]._id : null);
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 shadow-2xl overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold gradient-text">🤖 ChatBot</h1>
          <p className="text-xs text-gray-400 mt-1">Powered by GPT-4</p>
          <p className="text-sm text-gray-300 mt-3 truncate">{user?.name}</p>
        </div>

        {/* New Chat Button */}
        <button
          onClick={createNewConversation}
          className="m-4 flex items-center justify-center gap-2 btn-primary bg-blue-600 hover:bg-blue-700"
        >
          <FiPlus size={20} /> New Chat
        </button>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-sm p-4 text-center">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => setSelectedConversation(conv._id)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedConversation === conv._id
                    ? 'bg-blue-600 shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <p className="text-sm font-medium text-white truncate">{conv.title}</p>
                <p className="text-xs text-gray-300 mt-1">{conv.messages.length} messages</p>
              </div>
            ))
          )}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-700 p-4 space-y-2">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            <FiBarChart3 size={20} /> Analytics
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 btn-danger"
          >
            <FiLogOut size={20} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-md flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-icon hover:bg-gray-200 text-gray-800"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'chat'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'testing'
                  ? 'bg-white text-red-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiBeaker size={18} /> Testing
            </button>
          </div>

          <div className="text-sm text-gray-600">Version 1.0</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'chat' && selectedConversation && (
            <ChatWindow conversationId={selectedConversation} />
          )}
          {activeTab === 'testing' && <TestingTab />}
        </div>
      </div>

      {/* Analytics Modal */}
      {showAnalytics && analytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card p-8 max-w-md w-full shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold gradient-text mb-6">📊 Your Analytics</h3>
            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Total Tokens</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.totalTokens.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Messages Sent</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.messagesCount}</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Avg Tokens/Message</p>
                <p className="text-3xl font-bold text-green-600">{analytics.averageTokensPerMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAnalytics(false)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
