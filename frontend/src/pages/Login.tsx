import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store/useStore';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from 'react-icons/fi';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, setUser } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { email, password, name };

      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);

      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse" aria-hidden="true"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" aria-hidden="true"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" aria-hidden="true"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="glass-effect backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-white border-opacity-30">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce" aria-hidden="true">
              🤖
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">ChatBot AI</h1>
            <p className="text-gray-600 text-sm font-medium">Powered by GPT-4 Turbo</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Authentication form">
            {/* Name Input (Register only) */}
            {!isLogin && (
              <div className="relative">
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <FiUser className="absolute left-3 top-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="input-primary pl-10 bg-white bg-opacity-90 focus:bg-white"
                  required
                  aria-label="Full Name"
                />
              </div>
            )}

            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <FiMail className="absolute left-3 top-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="input-primary pl-10 bg-white bg-opacity-90 focus:bg-white"
                required
                aria-label="Email Address"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <FiLock className="absolute left-3 top-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 8 characters)"
                className="input-primary pl-10 pr-10 bg-white bg-opacity-90 focus:bg-white"
                required
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline focus-visible:outline-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in"
                role="alert"
                aria-live="polite"
              >
                <span className="text-xl" aria-hidden="true">
                  ⚠️
                </span>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-3 font-bold shadow-lg hover:shadow-xl disabled:opacity-50"
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </span>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-8 pt-8 border-t border-gray-300 border-opacity-30 text-center">
            <p className="text-gray-700 text-sm font-medium mb-4">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setName('');
              }}
              className="btn-secondary w-full focus-visible:outline-gray-400"
              aria-label={isLogin ? 'Switch to registration' : 'Switch to login'}
            >
              {isLogin ? 'Create New Account' : 'Sign In Instead'}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
