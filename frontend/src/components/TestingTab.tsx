import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { FiPlay, FiRotateCcw, FiCopy, FiCheck } from 'react-icons/fi';

const TestingTab: React.FC = () => {
  const [sessionId] = useState(uuidv4());
  const [query, setQuery] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { token } = useStore();

  const executeQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/testing/query',
        {
          sessionId,
          query,
          systemPrompt: systemPrompt || undefined,
          temperature,
          maxTokens,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const responseId = uuidv4();
      setResponses((prev) => [
        ...prev,
        {
          id: responseId,
          query,
          response: response.data.response,
          timestamp: new Date(),
        },
      ]);
      setQuery('');
    } catch (error) {
      console.error('Testing query failed:', error);
      alert('Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    if (window.confirm('Clear all queries?')) {
      setResponses([]);
      setQuery('');
      setSystemPrompt('');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 rounded-xl overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold gradient-text mb-2">🔬 Unrestricted Testing Lab</h2>
        <p className="text-gray-400 text-lg">
          Everything is unrestricted here. Test any prompt, any behavior, any configuration.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Temperature */}
        <div className="card-dark p-4">
          <label className="block text-sm font-bold text-blue-400 mb-3">🌡️ Temperature</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">Deterministic</span>
            <span className="text-lg font-bold text-blue-400">{temperature.toFixed(1)}</span>
            <span className="text-xs text-gray-400">Creative</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div className="card-dark p-4">
          <label className="block text-sm font-bold text-purple-400 mb-3">📝 Max Tokens</label>
          <input
            type="number"
            min="100"
            max="4000"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="input-dark"
          />
          <p className="text-xs text-gray-400 mt-2">Total tokens: {maxTokens.toLocaleString()}</p>
        </div>
      </div>

      {/* System Prompt */}
      <div className="mb-6 card-dark p-4">
        <label className="block text-sm font-bold text-pink-400 mb-2">🎭 System Prompt (Optional)</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Define custom instructions for unrestricted testing..."
          className="input-dark h-24 font-mono text-sm"
        />
      </div>

      {/* Query Input */}
      <div className="mb-6 card-dark p-4">
        <label className="block text-sm font-bold text-green-400 mb-2">⚡ Query</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your unrestricted query here..."
          className="input-dark h-32 font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={executeQuery}
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-2 flex-1 text-lg py-4"
        >
          <FiPlay size={24} />
          {loading ? 'Executing...' : 'Execute Query'}
        </button>
        <button
          onClick={clearSession}
          className="btn-secondary flex items-center justify-center gap-2 px-6 py-4 text-lg hover:bg-gray-600 text-gray-200"
        >
          <FiRotateCcw size={24} />
          Clear
        </button>
      </div>

      {/* Responses */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-300 mb-4">📋 Query History ({responses.length})</h3>
        {responses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No queries executed yet. Run a query to see results here.</p>
          </div>
        ) : (
          responses.map((resp) => (
            <div key={resp.id} className="card-dark p-5 border-l-4 border-blue-500 animate-fade-in">
              <div className="flex justify-between items-start mb-3">
                <p className="text-yellow-300 font-bold text-sm flex-1">Q: {resp.query.substring(0, 100)}...</p>
                <button
                  onClick={() => copyToClipboard(resp.response, resp.id)}
                  className="ml-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs flex items-center gap-1 transition-colors"
                >
                  {copiedId === resp.id ? (
                    <>
                      <FiCheck size={14} /> Copied
                    </>
                  ) : (
                    <>
                      <FiCopy size={14} /> Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-green-300 text-sm whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto">
                {resp.response}
              </p>
              <p className="text-gray-500 text-xs mt-3">
                🕐 {new Date(resp.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestingTab;
