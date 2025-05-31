import React from 'react';

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glowing circle */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#0076FF] opacity-70 animate-pulse" 
        style={{ boxShadow: "0 0 15px rgba(0, 240, 255, 0.8)" }}
      />
      
      {/* Inner circle with stylized L */}
      <div className="absolute inset-1 rounded-full bg-[#0E0E10] flex items-center justify-center">
        <span className="text-[#00F0FF] font-bold" style={{ fontSize: size * 0.5, lineHeight: 1 }}>L</span>
      </div>
      
      {/* Small droplet/liquid effect */}
      <div 
        className="absolute w-[25%] h-[25%] rounded-full bg-[#00F0FF] animate-bounce-slow" 
        style={{ 
          top: '10%', 
          right: '15%',
          boxShadow: "0 0 5px rgba(0, 240, 255, 0.8)"
        }}
      />
    </div>
  );
}

export default Logo;
