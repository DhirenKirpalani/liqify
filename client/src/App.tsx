import React, { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebSocketProvider } from "@/hooks/useWebSocket";
import { WalletProvider } from "@/hooks/useWallet";
import { MatchProvider } from "@/hooks/useMatch";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Match from "@/pages/Match";
import Leaderboard from "@/pages/Leaderboard";
import Reels from "@/pages/Reels";
import Profile from "@/pages/Profile";
import Wallet from "@/pages/Wallet";
import Admin from "@/pages/Admin";
import CandlestickChartPage from "@/pages/CandlestickChart";
import NotFound from "@/pages/not-found";

function Router(): JSX.Element {
  useEffect(() => {
    // Create styles for the hexgrid and particles
    const style = document.createElement('style');
    style.textContent = `
      #hex-grid {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
        pointer-events: none;
        background-color: #0E0E10;
      }
      
      .hexagon {
        position: absolute;
        width: 50px;
        height: 50px;
        background-color: rgba(14, 14, 16, 0.8);
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        transition: all 0.3s ease;
        opacity: 0.15;
        animation: pulse 6s infinite;
      }
      
      .no-animation {
        animation: none !important;
      }
      
      .hex-dark {
        background-color: rgba(30, 30, 40, 0.3);
      }
      
      .hex-cyan {
        background-color: rgba(0, 240, 255, 0.15);
        box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
        opacity: 0.6;
      }
      
      .hex-purple {
        background-color: rgba(204, 51, 255, 0.15);
        box-shadow: 0 0 15px rgba(204, 51, 255, 0.4);
        opacity: 0.6;
      }
      
      .hex-yellow {
        background-color: rgba(255, 204, 0, 0.15);
        box-shadow: 0 0 15px rgba(255, 204, 0, 0.4);
        opacity: 0.6;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.15; }
        50% { transform: scale(1.05); opacity: 0.2; }
        100% { transform: scale(1); opacity: 0.15; }
      }
      
      .circuit-line {
        position: absolute;
        height: 2px;
        background: linear-gradient(to right, transparent, #00F0FF, transparent);
        box-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
        animation: circuit-glow 3s infinite;
        opacity: 0.6;
        pointer-events: none;
      }
      
      @keyframes circuit-glow {
        0% { opacity: 0.2; }
        50% { opacity: 0.8; }
        100% { opacity: 0.2; }
      }
      
      /* Power dots at intersections */
      .circuit-line::before, .circuit-line::after {
        content: '';
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: inherit;
        box-shadow: inherit;
      }
      
      .circuit-line::before {
        left: 0;
      }
      
      .circuit-line::after {
        right: 0;
      }
      
      /* Cursor particle effects */
      .cursor-particle {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        background-color: currentColor;
        box-shadow: 0 0 10px currentColor;
        transform-origin: center center;
        will-change: transform, opacity;
      }
    `;
    document.head.appendChild(style);

    // Create our grid container and hexagon grid elements with performance optimizations
    function initGameBackground() {
      const hexGridContainer = document.createElement('div');
      hexGridContainer.id = 'hex-grid';
      hexGridContainer.style.position = 'fixed';
      hexGridContainer.style.top = '0';
      hexGridContainer.style.left = '0';
      hexGridContainer.style.width = '100%';
      hexGridContainer.style.height = '100%';
      hexGridContainer.style.zIndex = '1';
      hexGridContainer.style.pointerEvents = 'none';
      document.body.appendChild(hexGridContainer);
      
      // Define hexagon size and spacing - larger hexagons for fewer elements
      const hexSize = 70; // Increased from 50px for better performance
      
      // Get viewport dimensions
      const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      
      // Calculate fewer hexagons for better performance
      const cols = Math.ceil(viewportWidth / (hexSize * 3)) + 1; // Reduced density
      const rows = Math.ceil(viewportHeight / (hexSize * 2)) + 1; // Reduced density
      
      // Use DocumentFragment for better performance when adding many elements
      const fragment = document.createDocumentFragment();
      
      // Precompute colors and opacities to avoid repeated array creations
      const colors = ['#00F0FF', '#CC33FF', '#FFCC00', '#111111', '#222222'];
      const colorsLength = colors.length;
      
      // Create hexagons - fewer for better performance
      for(let row = 0; row < rows; row++) {
        // Only create hexagons for every other row for performance
        if (row % 2 === 0) continue;
        
        for(let col = 0; col < cols; col++) {
          // Only create hexagons for every other column for performance
          if (col % 2 === 0) continue;
          
          const hexagon = document.createElement('div');
          hexagon.className = 'hexagon';
          
          // Position with offset for every other row
          const offset = row % 2 === 0 ? 0 : hexSize * 0.75;
          hexagon.style.left = (col * hexSize * 1.5 + offset) + 'px';
          hexagon.style.top = (row * hexSize * 0.866) + 'px';
          
          // Random cyberpunk color - more efficient random color selection
          const randomColor = colors[Math.floor(Math.random() * colorsLength)];
          hexagon.style.backgroundColor = randomColor;
          
          // Random animation delay for pulse effect - limit animation complexity
          // Only animate 50% of hexagons for better performance
          if (Math.random() > 0.5) {
            hexagon.style.animationDelay = (Math.random() * 5) + 's';
          } else {
            hexagon.classList.add('no-animation'); // Don't animate this hexagon
          }
          
          // Add opacity variations
          hexagon.style.opacity = (Math.random() * 0.2 + 0.05).toString();
          
          fragment.appendChild(hexagon);
        }
      }
      
      // Add circuit lines - reduced number significantly for performance
      const circuitCount = Math.min(8, Math.floor((cols * rows) / 20));
      
      // Precompute circuit colors
      const circuitColors = ['#00F0FF', '#CC33FF', '#FFCC00', '#90D8E4'];
      const circuitColorsLength = circuitColors.length;
      
      for(let i = 0; i < circuitCount; i++) {
        const circuit = document.createElement('div');
        circuit.className = 'circuit-line';
        
        // Random position
        circuit.style.left = (Math.random() * viewportWidth) + 'px';
        circuit.style.top = (Math.random() * viewportHeight) + 'px';
        
        // Random length and angle
        const length = Math.random() * 200 + 50;
        circuit.style.width = length + 'px';
        circuit.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        
        // Random color - more efficient color selection
        const randomColor = circuitColors[Math.floor(Math.random() * circuitColorsLength)];
        circuit.style.backgroundColor = randomColor;
        circuit.style.boxShadow = '0 0 8px ' + randomColor;
        
        // Random animation delay
        circuit.style.animationDelay = (Math.random() * 3) + 's';
        
        fragment.appendChild(circuit);
      }
      
      // Add all elements at once for better performance
      hexGridContainer.appendChild(fragment);
    }
    
    // Initialize and handle browser events
    const resizeHandler = () => {
      // Clear and rebuild on resize for better performance
      const hexGrid = document.getElementById('hex-grid');
      if (hexGrid) {
        // Remove all children first
        while (hexGrid.firstChild) {
          hexGrid.removeChild(hexGrid.firstChild);
        }
        // Rebuild with optimized performance settings
        initGameBackground();
      }
    };
    
    window.addEventListener('load', initGameBackground);
    window.addEventListener('resize', resizeHandler);
    
    // Initialize immediately if DOM is already loaded
    if (document.readyState === 'complete') {
      initGameBackground();
    } else {
      document.addEventListener('DOMContentLoaded', initGameBackground);
    }
      
    // Add cursor particle effect (optimized for performance)
    // Using TypeScript-friendly approach
    interface Particle {
      element: HTMLDivElement;
      vx: number;
      vy: number;
      life: number;
      opacity: number;
      posX: number;
      posY: number;
      scale: number;
    }
      
    const particles: Particle[] = [];
    const particleCount = 5; // Reduced for better performance
    const colors = ['#00F0FF', '#CC33FF', '#FFCC00', '#90D8E4', '#FF6600'];
    let lastMouseMoveTime = 0;
    const mouseMoveThrottle = 100; // increased throttle for better performance
      
    function createParticle(x: number, y: number): void {
      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.color = colors[Math.floor(Math.random() * colors.length)];
      const scale = Math.random() * 0.5 + 0.2;
      particle.style.transform = 'scale(' + scale + ')';
        
      const hexGrid = document.getElementById('hex-grid');
      if (hexGrid) {
        hexGrid.appendChild(particle);
      }
        
      // Store particle data with TypeScript-friendly property names
      const vx = Math.random() * 3 - 1.5; // Reduced velocity
      const vy = Math.random() * 3 - 1.5;
      const life = Math.random() * 800 + 400; // Shorter lifespan
      const opacity = Math.random() * 0.5 + 0.5;
      particle.style.opacity = opacity.toString();
        
      particles.push({
        element: particle,
        vx: vx,
        vy: vy,
        life: life,
        opacity: opacity,
        posX: x,
        posY: y,
        scale: scale
      });
        
      // Remove old particles if too many
      if (particles.length > 30) { // Reduced max particles
        const old = particles.shift();
        if (old && old.element.parentNode) {
          old.element.parentNode.removeChild(old.element);
        }
      }
    }
      
    // Use requestAnimationFrame timing for smoother performance
    let lastFrameTime = 0;
    function updateParticles(timestamp: number): void {
      // Calculate actual time elapsed (for smoother animation regardless of frame rate)
      const deltaTime = lastFrameTime ? Math.min(timestamp - lastFrameTime, 30) : 16;
      lastFrameTime = timestamp;
        
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= deltaTime; // Use actual frame time
          
        if (p.life <= 0) {
          if (p.element.parentNode) {
            p.element.parentNode.removeChild(p.element);
          }
          particles.splice(i, 1);
          continue;
        }
          
        // Update position (simplified animation for performance)
        p.posX += p.vx * (deltaTime / 16);
        p.posY += p.vy * (deltaTime / 16);
          
        // Set position directly instead of using transform for performance
        p.element.style.left = p.posX + 'px';
        p.element.style.top = p.posY + 'px';
          
        // Fade out
        const newOpacity = (p.life / 800 * p.opacity);
        p.element.style.opacity = newOpacity.toString();
      }
        
      requestAnimationFrame(updateParticles);
    }
      
    // Start the animation loop
    requestAnimationFrame(updateParticles);
      
    // Throttled mouse move handler to reduce CPU usage
    const mouseMoveHandler = function(e: MouseEvent) {
      const now = Date.now();
      if (now - lastMouseMoveTime > mouseMoveThrottle) {
        lastMouseMoveTime = now;
        // Create particles on mouse move (reduced frequency)
        if (Math.random() > 0.85) { // Lower chance to create particles
          createParticle(e.clientX, e.clientY);
        }
      }
    };
      
    const clickHandler = function(e: MouseEvent) {
      // Create more particles on click (but fewer for better performance)
      for (let i = 0; i < particleCount; i++) {
        createParticle(e.clientX, e.clientY);
      }
    };
      
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('click', clickHandler);
      
    // Return cleanup function
    return () => {
      // Remove event listeners
      window.removeEventListener('load', initGameBackground);
      window.removeEventListener('resize', resizeHandler);
      document.removeEventListener('DOMContentLoaded', initGameBackground);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('click', clickHandler);
      
      // Remove style element
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      
      // Remove hex grid container
      const hexGrid = document.getElementById('hex-grid');
      if (hexGrid && hexGrid.parentNode) {
        hexGrid.parentNode.removeChild(hexGrid);
      }
    };
  }, []);

  return (
    <div style={{ 
      backgroundColor: "#0E0E10", 
      color: "#F2F2F2",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "visible"
    }}>
      {/* Background elements wrapper with lower z-index */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
        {/* Interactive hexgrid background */}
        <div id="hex-grid" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}></div>
        
        {/* Radial gradient overlay */}
        <div style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%", 
          background: "radial-gradient(circle at 15% 15%, rgba(204, 51, 255, 0.08) 0%, transparent 60%), radial-gradient(circle at 85% 85%, rgba(0, 240, 255, 0.08) 0%, transparent 60%)"
        }}></div>
      </div>
      
      {/* Liquid gradient in corner */}
      <div style={{
        position: "absolute",
        bottom: "-150px",
        right: "-150px",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(255, 102, 0, 0.2), rgba(255, 204, 0, 0.1))",
        filter: "blur(60px)"
      }}></div>
      
      {/* Game grid accent lighting */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "-100px",
        width: "200px",
        height: "500px",
        background: "linear-gradient(90deg, rgba(168, 230, 225, 0.15), transparent)",
        filter: "blur(30px)",
        transform: "rotate(15deg)"
      }}></div>
      
      {/* Top corner accents with neon glow */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "120px", height: "120px" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "120px", background: "linear-gradient(to bottom, #00F0FF, transparent)", boxShadow: "0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.4)" }}></div>
        <div style={{ position: "absolute", top: 0, left: 0, width: "120px", height: "3px", background: "linear-gradient(to right, #00F0FF, transparent)", boxShadow: "0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.4)" }}></div>
      </div>
      
      <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "3px", height: "120px", background: "linear-gradient(to bottom, #CC33FF, transparent)", boxShadow: "0 0 10px rgba(204, 51, 255, 0.8), 0 0 20px rgba(204, 51, 255, 0.4)" }}></div>
        <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "3px", background: "linear-gradient(to left, #CC33FF, transparent)", boxShadow: "0 0 10px rgba(204, 51, 255, 0.8), 0 0 20px rgba(204, 51, 255, 0.4)" }}></div>
      </div>
      
      {/* Bottom corner accents */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "120px", height: "120px" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "3px", height: "120px", background: "linear-gradient(to top, #90D8E4, transparent)", boxShadow: "0 0 10px rgba(144, 216, 228, 0.7), 0 0 15px rgba(144, 216, 228, 0.3)" }}></div>
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "120px", height: "3px", background: "linear-gradient(to right, #90D8E4, transparent)", boxShadow: "0 0 10px rgba(144, 216, 228, 0.7), 0 0 15px rgba(144, 216, 228, 0.3)" }}></div>
      </div>
      
      {/* Diagonal accents for motion effect */}
      <div style={{ position: "absolute", top: "40%", right: "-50px", width: "200px", height: "4px", background: "linear-gradient(to left, #FFCC00, transparent)", transform: "rotate(35deg)", boxShadow: "0 0 15px rgba(255, 204, 0, 0.8), 0 0 30px rgba(255, 204, 0, 0.4)" }}></div>
      <div style={{ position: "absolute", bottom: "30%", left: "-50px", width: "200px", height: "4px", background: "linear-gradient(to right, #FF6600, transparent)", transform: "rotate(-35deg)", boxShadow: "0 0 15px rgba(255, 102, 0, 0.8), 0 0 30px rgba(255, 102, 0, 0.4)" }}></div>
      
      {/* Fixed navbar */}
      <NavBar />
      
      {/* Spacer div to push content below navbar */}
      <div style={{ height: "50px" }}></div>
      <main style={{ 
        paddingTop: "0", 
        paddingBottom: "0", 
        marginTop: "5px",
        flex: "1 0 auto",
        position: "relative",
        zIndex: "5",
        width: "100%",
        overflowY: "visible"
      }}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/match" component={Match} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/reels" component={Reels} />
          <Route path="/profile" component={Profile} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/admin" component={Admin} />
          <Route path="/charts/:symbol" component={CandlestickChartPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  useEffect(() => {
    // Set theme to dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <WalletProvider>
          <MatchProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </MatchProvider>
        </WalletProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  );
}

export default App;
