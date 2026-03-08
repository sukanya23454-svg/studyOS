import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import type { AnimationType } from '@/components/AnimatedBackground';

import envRainyCafe from '@/assets/env-rainy-cafe.jpg';
import envCozyLibrary from '@/assets/env-cozy-library.jpg';
import envNightCity from '@/assets/env-night-city.jpg';
import envForestCabin from '@/assets/env-forest-cabin.jpg';

export interface StudyEnvironment {
  id: string;
  name: string;
  emoji: string;
  description: string;
  image?: string;
  gradient: string;
  animation: AnimationType;
  ambientId: string; // maps to MusicPlayer AMBIENT_SOUNDS id
}

// Ambient sound IDs: rain, thunderstorm, fireplace, cafe, birds, ocean
export const ENVIRONMENTS: StudyEnvironment[] = [
  {
    id: 'rainy-cafe', name: 'Rainy Café', emoji: '☕',
    description: 'Warm café lighting with rain on the window',
    image: envRainyCafe, gradient: 'linear-gradient(135deg, #2d1b0e 0%, #4a2c17 40%, #1a1a2e 100%)',
    animation: 'rain', ambientId: 'rain',
  },
  {
    id: 'cozy-library', name: 'Cozy Library', emoji: '📚',
    description: 'Dim warm lights and quiet book-filled shelves',
    image: envCozyLibrary, gradient: 'linear-gradient(135deg, #1c1410 0%, #3d2b1f 50%, #1a1408 100%)',
    animation: 'dust', ambientId: 'fireplace',
  },
  {
    id: 'night-city', name: 'Night City Desk', emoji: '🌃',
    description: 'Desk overlooking a glowing city skyline',
    image: envNightCity, gradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0d0d2b 100%)',
    animation: 'flicker', ambientId: 'cafe',
  },
  {
    id: 'forest-cabin', name: 'Forest Cabin', emoji: '🌲',
    description: 'Wooden cabin with forest outside the window',
    image: envForestCabin, gradient: 'linear-gradient(135deg, #0d1a0d 0%, #1a2e1a 50%, #0a140a 100%)',
    animation: 'leaves', ambientId: 'birds',
  },
  {
    id: 'rainy-bedroom', name: 'Rainy Bedroom', emoji: '🌧️',
    description: 'Cozy bedroom with rain tapping on the window',
    gradient: 'linear-gradient(145deg, #1a1520 0%, #2a2035 40%, #141028 100%)',
    animation: 'rain', ambientId: 'rain',
  },
  {
    id: 'lofi-bedroom', name: 'Lo-fi Bedroom', emoji: '🎵',
    description: 'Purple-lit bedroom with warm lo-fi vibes',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 40%, #0d0a1a 100%)',
    animation: 'dust', ambientId: 'rain',
  },
  {
    id: 'mountain-cabin', name: 'Mountain Cabin', emoji: '🏔️',
    description: 'Rustic cabin with mountain views and crisp air',
    gradient: 'linear-gradient(145deg, #1a2030 0%, #2a3545 40%, #0f1520 100%)',
    animation: 'clouds', ambientId: 'birds',
  },
  {
    id: 'zen-garden', name: 'Japanese Zen Garden', emoji: '🎋',
    description: 'Peaceful zen garden with flowing water',
    gradient: 'linear-gradient(135deg, #0a1a0f 0%, #1a3025 40%, #0d1a12 100%)',
    animation: 'leaves', ambientId: 'birds',
  },
  {
    id: 'dark-academia', name: 'Dark Academia Study', emoji: '🏛️',
    description: 'Rich wood and leather with candlelight',
    gradient: 'linear-gradient(135deg, #1a1008 0%, #2e1f0a 40%, #0d0a05 100%)',
    animation: 'flicker', ambientId: 'fireplace',
  },
  {
    id: 'vintage-study', name: 'Vintage Study Room', emoji: '📜',
    description: 'Antique desk with warm lamp and old books',
    gradient: 'linear-gradient(145deg, #1a1510 0%, #2e2518 40%, #0f0d08 100%)',
    animation: 'dust', ambientId: 'fireplace',
  },
  {
    id: 'space-station', name: 'Space Station Window', emoji: '🚀',
    description: 'Floating desk with Earth visible below',
    gradient: 'linear-gradient(135deg, #020208 0%, #0a0a2e 30%, #000010 100%)',
    animation: 'stars', ambientId: 'ocean',
  },
  {
    id: 'ocean-cliff', name: 'Ocean Cliff Desk', emoji: '🌊',
    description: 'Cliff-side desk with ocean breeze and waves',
    gradient: 'linear-gradient(145deg, #0a1a2e 0%, #1a3050 40%, #081420 100%)',
    animation: 'waves', ambientId: 'ocean',
  },
  {
    id: 'sunset-balcony', name: 'Sunset Balcony Desk', emoji: '🌅',
    description: 'Golden hour light on a quiet balcony',
    gradient: 'linear-gradient(135deg, #2e1a0a 0%, #4a2a10 30%, #1a1008 100%)',
    animation: 'dust', ambientId: 'birds',
  },
  {
    id: 'winter-cabin', name: 'Winter Snow Cabin', emoji: '❄️',
    description: 'Warm cabin with snow falling outside',
    gradient: 'linear-gradient(145deg, #1a2030 0%, #2a3548 40%, #101828 100%)',
    animation: 'snow', ambientId: 'fireplace',
  },
  {
    id: 'autumn-forest', name: 'Autumn Forest Desk', emoji: '🍂',
    description: 'Golden leaves drifting past your window',
    gradient: 'linear-gradient(135deg, #1a1508 0%, #2e2010 40%, #141008 100%)',
    animation: 'leaves', ambientId: 'birds',
  },
  {
    id: 'lake-house', name: 'Lake House Study', emoji: '🏡',
    description: 'Calm lake view with morning mist',
    gradient: 'linear-gradient(145deg, #0a1520 0%, #1a2a3a 40%, #081018 100%)',
    animation: 'clouds', ambientId: 'ocean',
  },
  {
    id: 'underground-library', name: 'Underground Library', emoji: '🕯️',
    description: 'Deep underground with ancient tomes',
    gradient: 'linear-gradient(135deg, #0d0a08 0%, #1a1510 40%, #080605 100%)',
    animation: 'flicker', ambientId: 'fireplace',
  },
  {
    id: 'medieval-study', name: 'Candlelit Medieval Study', emoji: '🏰',
    description: 'Stone walls and flickering candlelight',
    gradient: 'linear-gradient(145deg, #1a1008 0%, #2a1a0d 40%, #0d0805 100%)',
    animation: 'flicker', ambientId: 'fireplace',
  },
  {
    id: 'cyberpunk-city', name: 'Cyberpunk City Desk', emoji: '💜',
    description: 'Neon-lit desk in a futuristic cityscape',
    gradient: 'linear-gradient(135deg, #0a0a20 0%, #1a0a30 30%, #200a2a 60%, #0a0a18 100%)',
    animation: 'neon-pulse', ambientId: 'cafe',
  },
  {
    id: 'museum-study', name: 'Quiet Museum Study', emoji: '🎨',
    description: 'Hushed gallery with soft spotlight',
    gradient: 'linear-gradient(145deg, #141210 0%, #201e1a 40%, #0d0c0a 100%)',
    animation: 'dust', ambientId: 'cafe',
  },
  {
    id: 'treehouse', name: 'Treehouse Study Room', emoji: '🌳',
    description: 'High in the canopy with sunlight filtering through',
    gradient: 'linear-gradient(135deg, #0a1a0a 0%, #1a2e18 40%, #081408 100%)',
    animation: 'fireflies', ambientId: 'birds',
  },
  {
    id: 'desert-camp', name: 'Desert Night Camp', emoji: '🏜️',
    description: 'Starry desert sky with a warm campfire',
    gradient: 'linear-gradient(145deg, #0a0808 0%, #1a1510 30%, #0a0a18 70%, #050510 100%)',
    animation: 'campfire-sparks', ambientId: 'fireplace',
  },
  {
    id: 'minimalist-white', name: 'Minimalist White Room', emoji: '🤍',
    description: 'Clean white space with soft natural light',
    gradient: 'linear-gradient(135deg, #1a1a20 0%, #24242a 40%, #18181e 100%)',
    animation: 'dust', ambientId: 'rain',
  },
  {
    id: 'greenhouse', name: 'Greenhouse Study Desk', emoji: '🌿',
    description: 'Surrounded by lush plants and warm humidity',
    gradient: 'linear-gradient(145deg, #0a1a10 0%, #142e1a 40%, #081410 100%)',
    animation: 'dust', ambientId: 'birds',
  },
  {
    id: 'floating-island', name: 'Floating Island Desk', emoji: '☁️',
    description: 'Magical desk on a floating island in the sky',
    gradient: 'linear-gradient(135deg, #0a1a30 0%, #1a3050 30%, #0a2040 100%)',
    animation: 'clouds', ambientId: 'birds',
  },
  {
    id: 'art-studio', name: 'Art Studio Study', emoji: '🎭',
    description: 'Creative studio with paint and warm light',
    gradient: 'linear-gradient(145deg, #1a1210 0%, #2a1e18 40%, #0f0d0a 100%)',
    animation: 'dust', ambientId: 'cafe',
  },
  {
    id: 'nordic-cabin', name: 'Nordic Cabin Study', emoji: '🦌',
    description: 'Scandinavian cabin with aurora borealis',
    gradient: 'linear-gradient(135deg, #0a1020 0%, #0a2030 30%, #081828 100%)',
    animation: 'stars', ambientId: 'fireplace',
  },
  {
    id: 'victorian-library', name: 'Victorian Library', emoji: '📖',
    description: 'Grand Victorian reading room with chandelier',
    gradient: 'linear-gradient(145deg, #18100a 0%, #2a1e10 40%, #100a05 100%)',
    animation: 'flicker', ambientId: 'fireplace',
  },
  {
    id: 'submarine', name: 'Ocean Submarine Window', emoji: '🐠',
    description: 'Deep sea view with bioluminescent creatures',
    gradient: 'linear-gradient(135deg, #020a1a 0%, #0a1a30 30%, #041020 100%)',
    animation: 'bubbles', ambientId: 'ocean',
  },
  {
    id: 'sky-deck', name: 'Sky Cloud Study Deck', emoji: '✈️',
    description: 'Open deck above the clouds at golden hour',
    gradient: 'linear-gradient(145deg, #1a2040 0%, #2a3058 30%, #1a1530 100%)',
    animation: 'clouds', ambientId: 'birds',
  },
];

interface EnvironmentContextType {
  activeEnvironment: StudyEnvironment | null;
  setEnvironment: (env: StudyEnvironment | null) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | null>(null);

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
  const [activeEnvironment, setActiveEnvironment] = useState<StudyEnvironment | null>(null);

  const setEnvironment = useCallback((env: StudyEnvironment | null) => {
    setActiveEnvironment(env);
  }, []);

  return (
    <EnvironmentContext.Provider value={{ activeEnvironment, setEnvironment }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) throw new Error('useEnvironment must be used within EnvironmentProvider');
  return ctx;
}
