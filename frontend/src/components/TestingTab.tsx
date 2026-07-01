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
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 sm:p-8 rounded-xl overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">🔬 Unrestricted Testing Lab</h2>
        <p className="text-gray-400 text-base sm:text-lg">
          Everything is unrestricted here. Test any prompt, any behavior, any configuration.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Temperature */}
        <div className="card-dark p-4">
          <label htmlFor="temperature" className="block text-sm font-bold text-blue-400 mb-3">
            🌡️ Temperature
          </label>
          <input
            id="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
            aria-label="Temperature setting from deterministic to creative"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">Deterministic</span>
            <span className="text-lg font-bold text-blue-400" aria-live="polite" aria-atomic="true">
              {temperature.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">Creative</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div className="card-dark p-4">
          <label htmlFor="maxTokens" className="block text-sm font-bold text-purple-400 mb-3">
            📝 Max Tokens
          </label>
          <input
            id="maxTokens"
            type="number"
            min="100"
            max="4000"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="input-dark text-base"
            aria-label="Maximum number of tokens for response"
          />
          <p className="text-xs text-gray-400 mt-2">Total tokens: {maxTokens.toLocaleString()}</p>
        </div>
      </div>

      {/* System Prompt */}
      <div className="mb-6 card-dark p-4">
        <label htmlFor="systemPrompt" className="block text-sm font-bold text-pink-400 mb-2">
          🎭 System Prompt (Optional)
        </label>
        <textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Define custom instructions for unrestricted testing..."
          className="input-dark h-24 font-mono text-sm"
          aria-label="Custom system prompt for testing"
        />
      </div>

      {/* Query Input */}
      <div className="mb-6 card-dark p-4">
        <label htmlFor="query" className="block text-sm font-bold text-green-400 mb-2">
          ⚡ Query
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your unrestricted query here..."
          className="input-dark h-32 font-mono text-sm"
          aria-label="Query input for testing"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={executeQuery}
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-2 flex-1 text-lg py-4"
          aria-label={loading ? 'Executing query' : 'Execute unrestricted query'}
        >
          <FiPlay size={24} aria-hidden="true" />
          {loading ? 'Executing...' : 'Execute Query'}
        </button>
        <button
          onClick={clearSession}
          className="btn-secondary flex items-center justify-center gap-2 px-6 py-4 text-lg hover:bg-gray-600 text-gray-200 w-full sm:w-auto"
          aria-label="Clear all queries from this session"
        >
          <FiRotateCcw size={24} aria-hidden="true" />
          Clear
        </button>
      </div>

      {/* Responses */}
      <section aria-labelledby="response-heading" className="space-y-4">
        <h3 id="response-heading" className="text-xl font-bold text-gray-300 mb-4">
          📋 Query History ({responses.length})
        </h3>
        {responses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No queries executed yet. Run a query to see results here.</p>
          </div>
        ) : (
          responses.map((resp) => (
            <article
              key={resp.id}
              className="card-dark p-5 border-l-4 border-blue-500 animate-fade-in"
              aria-label={`Query response ${responses.indexOf(resp) + 1}`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                <p className="text-yellow-300 font-bold text-sm flex-1 break-words">Q: {resp.query.substring(0, 100)}...</p>
                <button
                  onClick={() => copyToClipboard(resp.response, resp.id)}
                  className="ml-0 sm:ml-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs flex items-center gap-1 transition-colors focus-visible:outline focus-visible:outline-1 whitespace-nowrap"
                  aria-label={copiedId === resp.id ? 'Response copied to clipboard' : 'Copy response to clipboard'}
                >
                  {copiedId === resp.id ? (
                    <>
                      <FiCheck size={14} aria-hidden="true" /> Copied
                    </>
                  ) : (
                    <>
                      <FiCopy size={14} aria-hidden="true" /> Copy
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
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default TestingTab;
