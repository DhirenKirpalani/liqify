import React, { useState, useEffect } from 'react';
import logoSvg from '../assets/download.svg';

// Create a context to share the splash screen visibility state
export const SplashScreenContext = React.createContext<{ isVisible: boolean }>({ isVisible: true });

export function SplashScreenProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Hide the splash screen after a delay
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <SplashScreenContext.Provider value={{ isVisible }}>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-dark-bg z-[9999]">
          <img
            src={logoSvg}
            alt="Liqify Logo"
            className="w-64 h-64 md:w-96 md:h-96 animate-pulse"
          />
        </div>
      )}
      {children}
    </SplashScreenContext.Provider>
  );
}

export function useSplashScreen() {
  return React.useContext(SplashScreenContext);
}
