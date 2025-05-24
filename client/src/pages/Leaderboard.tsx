import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Leaderboard() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to home page
    setLocation('/');
    
    // After a short delay, scroll to the leaderboard section
    setTimeout(() => {
      const leaderboardSection = document.getElementById('leaderboard-section');
      if (leaderboardSection) {
        leaderboardSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, [setLocation]);

  // We won't actually render anything since we're redirecting immediately
  return null;
}
