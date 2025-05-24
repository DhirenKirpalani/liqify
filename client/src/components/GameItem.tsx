import React from 'react';
import { useLocation } from 'wouter';

interface GameItemProps {
  id: string;
  player1: string;
  player2: string;
  isActive?: boolean;
}

export default function GameItem({ id, player1, player2, isActive = false }: GameItemProps) {
  const [, setLocation] = useLocation();

  const handleJoinGame = () => {
    setLocation(`/match?id=${id}`);
  };

  return (
    <div 
      className="flex items-center py-3 px-4 border-b border-neutral/10 hover:bg-bg-secondary/30 cursor-pointer"
      onClick={handleJoinGame}
    >
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary mr-3">
        {isActive && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-profit"></span>
          </span>
        )}
        {!isActive && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )}
      </div>
      <div>
        <div className="text-white font-medium">{player1} vs {player2}</div>
      </div>
    </div>
  );
}
