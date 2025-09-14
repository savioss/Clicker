import React from 'react';
import { MonkeyIcon } from './icons/MonkeyIcon';

interface MonkeyScreenProps {
  email: string;
  userClicks: number;
  totalClicks: number;
  onMonkeyClick: () => void;
  onLogout: () => void;
  isScreaming: boolean;
}

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center flex-1">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

export const MonkeyScreen: React.FC<MonkeyScreenProps> = ({
  email,
  userClicks,
  totalClicks,
  onMonkeyClick,
  onLogout,
  isScreaming,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent space from scrolling
      onMonkeyClick();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl flex justify-between items-center">
        <div className="text-left">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="font-semibold text-yellow-400 break-all">{email}</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl text-center">
        <div className="w-full flex flex-col sm:flex-row gap-4 mb-8">
            <StatCard title="Your Clicks" value={userClicks.toLocaleString()} color="text-green-400" />
            <StatCard title="Total Clicks Worldwide" value={totalClicks.toLocaleString()} color="text-cyan-400" />
        </div>
        
        <div 
          onClick={onMonkeyClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className={`w-64 h-64 sm:w-80 sm:h-80 cursor-pointer rounded-full transition-transform transform duration-150 ease-in-out active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 ${isScreaming ? 'animate-shake' : ''}`}
          style={{
            animation: isScreaming ? 'shake 0.5s' : 'none'
          }}
          role="button"
          aria-label="Click me to make the monkey scream"
        >
          <MonkeyIcon isScreaming={isScreaming} className="w-full h-full drop-shadow-2xl" />
        </div>
        <p className="mt-6 text-gray-400 text-lg">Click the monkey!</p>
      </main>
      <footer className="w-full text-center text-gray-500 text-sm p-4">
        <p>&copy; {new Date().getFullYear()} Monkey Scream Clicker. All rights reserved.</p>
      </footer>
       <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};
