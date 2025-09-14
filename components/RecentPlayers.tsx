import React from 'react';

interface Player {
  email: string;
  clicks: number;
}

interface RecentPlayersProps {
  players: Player[];
}

export const RecentPlayers: React.FC<RecentPlayersProps> = ({ players }) => {
  if (players.length === 0) {
    return null; // Don't render anything if there are no players
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-2xl w-60 border border-gray-700">
        <h3 className="text-md font-semibold text-yellow-400 mb-3 text-center border-b border-gray-700 pb-2">
            Recent Activity
        </h3>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
            {players.map((player) => (
                <li key={player.email} className="flex justify-between items-center text-sm text-gray-300 animate-fade-in">
                    <span className="truncate pr-2" title={player.email}>{player.email}</span>
                    <span className="font-mono font-bold text-green-400 flex-shrink-0">{player.clicks.toLocaleString()}</span>
                </li>
            ))}
        </ul>
    </div>
  );
};
