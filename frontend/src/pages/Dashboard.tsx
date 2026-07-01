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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      setMobileOpen(false);
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed md:relative w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 shadow-2xl overflow-hidden z-40 md:z-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        aria-label="Navigation menu"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold gradient-text">🤖 ChatBot</h1>
          <p className="text-xs text-gray-400 mt-1">Powered by GPT-4</p>
          <p className="text-sm text-gray-300 mt-3 truncate" aria-label={`Logged in as ${user?.name}`}>
            {user?.name}
          </p>
        </div>

        {/* New Chat Button */}
        <button
          onClick={createNewConversation}
          className="m-4 flex items-center justify-center gap-2 btn-primary bg-blue-600 hover:bg-blue-700"
          aria-label="Create new conversation"
        >
          <FiPlus size={20} aria-hidden="true" /> New Chat
        </button>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2" role="list" aria-label="Conversations">
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-sm p-4 text-center">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => {
                  setSelectedConversation(conv._id);
                  setMobileOpen(false);
                }}
                role="listitem"
                className={`w-full text-left p-3 rounded-lg cursor-pointer transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  selectedConversation === conv._id
                    ? 'bg-blue-600 shadow-lg focus-visible:outline-blue-400'
                    : 'bg-gray-700 hover:bg-gray-600 focus-visible:outline-gray-400'
                }`}
                aria-label={`${conv.title}, ${conv.messages.length} messages`}
                aria-current={selectedConversation === conv._id ? 'page' : undefined}
              >
                <p className="text-sm font-medium text-white truncate">{conv.title}</p>
                <p className="text-xs text-gray-300 mt-1">{conv.messages.length} messages</p>
              </button>
            ))
          )}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-700 p-4 space-y-2">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 min-h-12"
            aria-label="View user analytics"
          >
            <FiBarChart3 size={20} aria-hidden="true" /> Analytics
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 btn-danger focus-visible:outline-red-400"
            aria-label="Sign out"
          >
            <FiLogOut size={20} aria-hidden="true" /> Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 shadow-md flex items-center justify-between p-4" role="banner">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn-icon hover:bg-gray-200 text-gray-800 md:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg" role="tablist">
            <button
              onClick={() => setActiveTab('chat')}
              role="tab"
              aria-selected={activeTab === 'chat'}
              aria-controls="chat-panel"
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 ${
                activeTab === 'chat'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              role="tab"
              aria-selected={activeTab === 'testing'}
              aria-controls="testing-panel"
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 ${
                activeTab === 'testing'
                  ? 'bg-white text-red-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiBeaker size={18} aria-hidden="true" /> Testing
            </button>
          </div>

          <div className="text-sm text-gray-600 hidden sm:block">Version 1.0</div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden p-4 sm:p-6" role="main">
          {activeTab === 'chat' && selectedConversation && (
            <div id="chat-panel" role="tabpanel">
              <ChatWindow conversationId={selectedConversation} />
            </div>
          )}
          {activeTab === 'testing' && (
            <div id="testing-panel" role="tabpanel">
              <TestingTab />
            </div>
          )}
        </main>
      </div>

      {/* Analytics Modal */}
      {showAnalytics && analytics && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="analytics-title"
          aria-modal="true"
        >
          <div className="card p-8 max-w-md w-full shadow-2xl animate-fade-in">
            <h3 id="analytics-title" className="text-2xl font-bold gradient-text mb-6">
              📊 Your Analytics
            </h3>
            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Total Tokens</p>
                <p className="text-3xl font-bold text-blue-600" aria-label={`Total tokens: ${analytics.totalTokens.toLocaleString()}`}>
                  {analytics.totalTokens.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Messages Sent</p>
                <p className="text-3xl font-bold text-purple-600" aria-label={`Messages sent: ${analytics.messagesCount}`}>
                  {analytics.messagesCount}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Avg Tokens/Message</p>
                <p
                  className="text-3xl font-bold text-green-600"
                  aria-label={`Average tokens per message: ${analytics.averageTokensPerMessage}`}
                >
                  {analytics.averageTokensPerMessage}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAnalytics(false)}
              className="btn-primary w-full"
              aria-label="Close analytics dialog"
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
