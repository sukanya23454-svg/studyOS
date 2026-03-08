import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

import envRainyCafe from '@/assets/env-rainy-cafe.jpg';
import envCozyLibrary from '@/assets/env-cozy-library.jpg';
import envNightCity from '@/assets/env-night-city.jpg';
import envForestCabin from '@/assets/env-forest-cabin.jpg';

export interface StudyEnvironment {
  id: string;
  name: string;
  emoji: string;
  description: string;
  image: string;
  ambientUrl: string;
}

export const ENVIRONMENTS: StudyEnvironment[] = [
  {
    id: 'rainy-cafe',
    name: 'Rainy Café',
    emoji: '☕',
    description: 'Warm café lighting with rain on the window',
    image: envRainyCafe,
    ambientUrl: 'https://cdn.freesound.org/previews/531/531947_6468985-lq.mp3',
  },
  {
    id: 'cozy-library',
    name: 'Cozy Library',
    emoji: '📚',
    description: 'Dim warm lights and quiet book-filled shelves',
    image: envCozyLibrary,
    ambientUrl: 'https://cdn.freesound.org/previews/424/424898_525929-lq.mp3',
  },
  {
    id: 'night-city',
    name: 'Night City View',
    emoji: '🌃',
    description: 'Desk overlooking a glowing city skyline',
    image: envNightCity,
    ambientUrl: 'https://cdn.freesound.org/previews/467/467539_5765286-lq.mp3',
  },
  {
    id: 'forest-cabin',
    name: 'Forest Cabin',
    emoji: '🌲',
    description: 'Wooden cabin with forest outside the window',
    image: envForestCabin,
    ambientUrl: 'https://cdn.freesound.org/previews/534/534919_4397472-lq.mp3',
  },
];

interface EnvironmentContextType {
  activeEnvironment: StudyEnvironment | null;
  setEnvironment: (env: StudyEnvironment | null) => void;
  ambientVolume: number;
  setAmbientVolume: (v: number) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | null>(null);

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
  const [activeEnvironment, setActiveEnvironment] = useState<StudyEnvironment | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(30);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setEnvironment = useCallback((env: StudyEnvironment | null) => {
    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    setActiveEnvironment(env);

    if (env) {
      const audio = new Audio(env.ambientUrl);
      audio.loop = true;
      audio.volume = ambientVolume / 100;
      audio.play().catch(() => {});
      audioRef.current = audio;
    }
  }, [ambientVolume]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = ambientVolume / 100;
    }
  }, [ambientVolume]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  return (
    <EnvironmentContext.Provider value={{ activeEnvironment, setEnvironment, ambientVolume, setAmbientVolume }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) throw new Error('useEnvironment must be used within EnvironmentProvider');
  return ctx;
}
