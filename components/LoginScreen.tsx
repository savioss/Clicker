
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      onLogin(email);
    } else {
      setError('Please enter a valid email address.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold text-yellow-400 mb-2">
          Monkey Scream Clicker
        </h1>
        <p className="text-gray-300 mb-8">
          Click the monkey. Hear him scream. Join the global phenomenon.
        </p>
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6">Enter Your Email to Play</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow"
              required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-500 transition-transform transform hover:scale-105"
            >
              Start Clicking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
