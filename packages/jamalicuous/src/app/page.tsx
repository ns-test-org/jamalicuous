'use client';

import { useState } from 'react';

interface SmokeCloud {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delay: number;
}

export default function FartApp() {
  const [smokeClouds, setSmokeCloud] = useState<SmokeCloud[]>([]);
  const [fartCount, setFartCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const smokeEmojis = ['💨', '☁️', '🌫️', '💭'];
  
  const playFartSound = () => {
    // Create a simple fart sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a fart-like sound with frequency modulation
      oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 0.2);
      oscillator.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.4);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.type = 'sawtooth';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch {
      // Fallback if Web Audio API is not supported
      console.log('Audio not supported, but the visual effects still work!');
    }
  };

  const handleFart = () => {
    setFartCount(prev => prev + 1);
    
    // Play fart sound if enabled
    if (soundEnabled) {
      playFartSound();
    }
    
    // Create multiple smoke clouds with random positions and delays
    const newClouds: SmokeCloud[] = [];
    const numClouds = Math.floor(Math.random() * 4) + 3; // 3-6 clouds
    
    for (let i = 0; i < numClouds; i++) {
      newClouds.push({
        id: Date.now() + i,
        x: Math.random() * 200 - 100, // Random x offset from -100px to 100px
        y: Math.random() * 50, // Random y offset from 0 to 50px
        emoji: smokeEmojis[Math.floor(Math.random() * smokeEmojis.length)],
        delay: i * 100, // Stagger the animations
      });
    }
    
    setSmokeCloud(prev => [...prev, ...newClouds]);
    
    // Remove clouds after animation completes
    setTimeout(() => {
      setSmokeCloud(prev => prev.filter(cloud => !newClouds.includes(cloud)));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-100 dark:from-green-900 dark:to-yellow-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Sound Toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-4 left-4 bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 text-green-800 dark:text-green-200 px-4 py-2 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
      >
        {soundEnabled ? '🔊' : '🔇'} {soundEnabled ? 'Sound On' : 'Sound Off'}
      </button>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-green-800 dark:text-green-200 mb-4">
          💨 FART APP 💨
        </h1>
        <p className="text-xl text-green-600 dark:text-green-300">
          Click the button and watch the magic happen!
        </p>
        <div className="mt-4 text-lg text-green-700 dark:text-green-200">
          Fart Count: <span className="font-bold text-2xl">{fartCount}</span>
        </div>
      </div>

      {/* Fart Button */}
      <div className="relative">
        <button
          onClick={handleFart}
          className="group relative bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-4xl px-16 py-8 rounded-full shadow-2xl transform transition-all duration-150 hover:scale-105 active:scale-95 border-4 border-yellow-300 hover:border-yellow-200"
        >
          <span className="drop-shadow-lg">💨 FART! 💨</span>
          
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
        </button>

        {/* Smoke Clouds */}
        {smokeClouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute pointer-events-none animate-smoke-rise"
            style={{
              left: `50%`,
              bottom: '100%',
              transform: `translateX(calc(-50% + ${cloud.x}px))`,
              animationDelay: `${cloud.delay}ms`,
              fontSize: '3rem',
            }}
          >
            {cloud.emoji}
          </div>
        ))}
      </div>

      {/* Fun Facts */}
      <div className="mt-12 text-center max-w-md">
        <div className="bg-white/80 dark:bg-black/40 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            🎉 Fun Fart Facts! 🎉
          </h3>
          <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <p>• The average person farts 14 times a day!</p>
            <p>• Farts can travel up to 10 feet per second!</p>
            <p>• Your farts are 59% nitrogen!</p>
            <p>• Keep clicking for more gas! 💨</p>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      {fartCount >= 10 && (
        <div className="fixed top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
          🏆 Fart Master! ({fartCount} farts)
        </div>
      )}
      
      {fartCount >= 50 && (
        <div className="fixed top-16 right-4 bg-orange-400 text-orange-900 px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
          💨 Gas Legend! ({fartCount} farts)
        </div>
      )}
    </div>
  );
}






