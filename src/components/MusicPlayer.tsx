import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useEnvironment } from '@/contexts/EnvironmentContext';

const PLAYLISTS = [
  { label: 'Lo-fi Beats', emoji: '🎧', spotifyUri: '0vvXsWCC9xrXsKd4FyS8kM' },
  { label: 'Soft Jazz', emoji: '🎷', spotifyUri: '37i9dQZF1DWV7EzJMK2FUI' },
  { label: 'Piano Focus', emoji: '🎹', spotifyUri: '37i9dQZF1DX4sWSpwq3LiO' },
  { label: 'Classical Focus', emoji: '🎻', spotifyUri: '37i9dQZF1DWWEJlAGA9gs0' },
  { label: 'Ambient Focus', emoji: '🌙', spotifyUri: '37i9dQZF1DX3Ogo9pFvBkY' },
];

export const AMBIENT_SOUNDS = [
  { id: 'rain', label: 'Rain', emoji: '🌧️', url: 'https://cdn.freesound.org/previews/531/531947_6468985-lq.mp3' },
  { id: 'thunderstorm', label: 'Thunderstorm', emoji: '⛈️', url: 'https://cdn.freesound.org/previews/401/401275_7740266-lq.mp3' },
  { id: 'fireplace', label: 'Fireplace', emoji: '🔥', url: 'https://cdn.freesound.org/previews/499/499257_2524387-lq.mp3' },
  { id: 'cafe', label: 'Café Noise', emoji: '☕', url: 'https://cdn.freesound.org/previews/424/424898_525929-lq.mp3' },
  { id: 'birds', label: 'Forest Birds', emoji: '🐦', url: 'https://cdn.freesound.org/previews/534/534919_4397472-lq.mp3' },
  { id: 'ocean', label: 'Ocean Waves', emoji: '🌊', url: 'https://cdn.freesound.org/previews/467/467539_5765286-lq.mp3' },
];

type Tab = 'music' | 'ambient';

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('ambient');
  const [activePlaylist, setActivePlaylist] = useState<typeof PLAYLISTS[0] | null>(null);
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { activeEnvironment } = useEnvironment();

  const isPlaying = !!activeAmbient || !!activePlaylist;

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const playAmbientById = useCallback((soundId: string) => {
    const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    const audio = new Audio(sound.url);
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume / 100;
    audio.play().catch(() => {});
    audioRef.current = audio;
    setActiveAmbient(sound.id);
    setIsPaused(false);
  }, [volume, isMuted]);

  const stopAmbient = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setActiveAmbient(null);
    setIsPaused(false);
  }, []);

  const playAmbient = useCallback((sound: typeof AMBIENT_SOUNDS[0]) => {
    if (activeAmbient === sound.id) {
      stopAmbient();
      return;
    }
    playAmbientById(sound.id);
  }, [activeAmbient, stopAmbient, playAmbientById]);

  // Auto-play ambient when environment changes
  useEffect(() => {
    if (activeEnvironment) {
      playAmbientById(activeEnvironment.ambientId);
    } else {
      stopAmbient();
    }
  }, [activeEnvironment]); // intentionally only depend on activeEnvironment

  const togglePause = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const activeAmbientLabel = AMBIENT_SOUNDS.find(s => s.id === activeAmbient);

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50" ref={panelRef}>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="w-[280px] rounded-2xl border border-border glass-panel shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                <span className="font-display text-sm font-semibold">Focus Music</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/60">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border/50">
              {(['ambient', 'music'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    tab === t ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'ambient' ? '🎧 Ambient' : '🎵 Playlists'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-2.5 max-h-[260px] overflow-y-auto">
              {tab === 'ambient' ? (
                <div className="grid grid-cols-2 gap-1.5">
                  {AMBIENT_SOUNDS.map(sound => (
                    <button
                      key={sound.id}
                      onClick={() => playAmbient(sound)}
                      className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-left text-xs font-medium transition-all ${
                        activeAmbient === sound.id
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-transparent'
                      }`}
                    >
                      <span className="text-sm">{sound.emoji}</span>
                      <span className="truncate">{sound.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {PLAYLISTS.map(pl => (
                    <button
                      key={pl.spotifyUri}
                      onClick={() => setActivePlaylist(activePlaylist?.spotifyUri === pl.spotifyUri ? null : pl)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-medium transition-all ${
                        activePlaylist?.spotifyUri === pl.spotifyUri
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-transparent'
                      }`}
                    >
                      <span className="text-sm">{pl.emoji}</span>
                      <span>{pl.label}</span>
                    </button>
                  ))}
                  {activePlaylist && (
                    <iframe
                      key={activePlaylist.spotifyUri}
                      src={`https://open.spotify.com/embed/playlist/${activePlaylist.spotifyUri}?utm_source=generator&theme=0`}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-xl mt-1"
                      title={activePlaylist.label}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Controls bar */}
            {activeAmbient && (
              <div className="px-3 py-2 border-t border-border/50 flex items-center gap-2">
                <button onClick={togglePause} className="text-primary hover:text-primary/80 transition-colors">
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <span className="text-[10px] text-muted-foreground truncate flex-shrink-0">
                  {activeAmbientLabel?.emoji} {activeAmbientLabel?.label}
                </span>
                <button onClick={() => setIsMuted(!isMuted)} className="text-muted-foreground hover:text-foreground transition-colors ml-auto">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={([v]) => { setVolume(v); setIsMuted(false); }}
                  max={100}
                  step={1}
                  className="w-16"
                />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 h-10 rounded-full gradient-primary shadow-elevated glow-primary"
          >
            <Music className="w-4 h-4 text-primary-foreground" />
            <span className="text-xs font-medium text-primary-foreground">
              {isPlaying ? (activeAmbientLabel?.label || activePlaylist?.label) : 'Focus Music'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
