import React, { useState } from 'react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';

const TestingTab: React.FC = () => {
  const [sessionId] = useState(uuidv4());
  const [query, setQuery] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState(4000);
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

      setResponses((prev) => [
        ...prev,
        {
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
    setResponses([]);
    setQuery('');
    setSystemPrompt('');
  };

  return (
    <div className="h-full bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🧪 Unrestricted Testing Tab</h2>
      <p className="text-gray-400 mb-6">
        Everything is unrestricted here. Test any prompt, any model behavior, any configuration.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Temperature</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-400 mt-1">Current: {temperature.toFixed(1)}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Max Tokens</label>
          <input
            type="number"
            min="100"
            max="4000"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">System Prompt (Optional)</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Custom system prompt for unrestricted testing..."
          className="w-full h-24 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Query</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your unrestricted query here..."
          className="w-full h-32 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={executeQuery}
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 px-6 py-2 rounded font-semibold transition"
        >
          {loading ? 'Executing...' : 'Execute Unrestricted Query'}
        </button>
        <button
          onClick={clearSession}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded font-semibold transition"
        >
          Clear
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {responses.map((resp, idx) => (
          <div key={idx} className="bg-gray-800 p-4 rounded border border-gray-700">
            <p className="text-yellow-400 font-semibold mb-2">Q: {resp.query}</p>
            <p className="text-green-400 text-sm whitespace-pre-wrap">{resp.response}</p>
            <p className="text-gray-500 text-xs mt-2">{new Date(resp.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestingTab;
