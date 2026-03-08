import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const PLAYLISTS = [
  { label: 'Lo-fi Beats', emoji: '🎧', spotifyUri: '0vvXsWCC9xrXsKd4FyS8kM' },
  { label: 'Soft Jazz', emoji: '🎷', spotifyUri: '37i9dQZF1DWV7EzJMK2FUI' },
  { label: 'Piano Focus', emoji: '🎹', spotifyUri: '37i9dQZF1DX4sWSpwq3LiO' },
  { label: 'Classical Focus', emoji: '🎻', spotifyUri: '37i9dQZF1DWWEJlAGA9gs0' },
  { label: 'Ambient Focus', emoji: '🌙', spotifyUri: '37i9dQZF1DX3Ogo9pFvBkY' },
  { label: 'Deep Focus', emoji: '🧠', spotifyUri: '37i9dQZF1DWZeKCadgRdKQ' },
];

const AMBIENT_SOUNDS = [
  {
    id: 'rain',
    label: 'Rain',
    emoji: '🌧️',
    // Free public domain rain audio
    url: 'https://cdn.freesound.org/previews/531/531947_6468985-lq.mp3',
  },
  {
    id: 'thunderstorm',
    label: 'Thunderstorm',
    emoji: '⛈️',
    url: 'https://cdn.freesound.org/previews/401/401275_7740266-lq.mp3',
  },
  {
    id: 'fireplace',
    label: 'Fireplace',
    emoji: '🔥',
    url: 'https://cdn.freesound.org/previews/499/499257_2524387-lq.mp3',
  },
  {
    id: 'cafe',
    label: 'Café Noise',
    emoji: '☕',
    url: 'https://cdn.freesound.org/previews/424/424898_525929-lq.mp3',
  },
  {
    id: 'birds',
    label: 'Forest Birds',
    emoji: '🐦',
    url: 'https://cdn.freesound.org/previews/534/534919_4397472-lq.mp3',
  },
  {
    id: 'ocean',
    label: 'Ocean Waves',
    emoji: '🌊',
    url: 'https://cdn.freesound.org/previews/467/467539_5765286-lq.mp3',
  },
];

type Tab = 'music' | 'ambient';

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('ambient');
  const [activePlaylist, setActivePlaylist] = useState<typeof PLAYLISTS[0] | null>(null);
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPlaying = !!activeAmbient || !!activePlaylist;

  const stopAmbient = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setActiveAmbient(null);
  }, []);

  const playAmbient = useCallback((sound: typeof AMBIENT_SOUNDS[0]) => {
    // Stop any currently playing ambient
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    if (activeAmbient === sound.id) {
      stopAmbient();
      return;
    }

    const audio = new Audio(sound.url);
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume / 100;
    audio.play().catch(() => {});
    audioRef.current = audio;
    setActiveAmbient(sound.id);
  }, [activeAmbient, volume, isMuted, stopAmbient]);

  // Update volume on playing audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="w-[320px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                <span className="font-display text-sm font-semibold">Focus Sounds</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setTab('ambient')}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  tab === 'ambient'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🎧 Ambient Sounds
              </button>
              <button
                onClick={() => setTab('music')}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  tab === 'music'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🎵 Spotify Music
              </button>
            </div>

            {tab === 'ambient' ? (
              <>
                {/* Ambient grid */}
                <div className="p-3 grid grid-cols-2 gap-2">
                  {AMBIENT_SOUNDS.map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => playAmbient(sound)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                        activeAmbient === sound.id
                          ? 'bg-primary/15 text-primary border border-primary/30 animate-pulse-glow'
                          : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary border border-transparent'
                      }`}
                    >
                      <span className="text-base">{sound.emoji}</span>
                      <span className="truncate">{sound.label}</span>
                    </button>
                  ))}
                </div>

                {/* Volume control */}
                {activeAmbient && (
                  <div className="px-4 pb-3 flex items-center gap-3">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-muted-foreground hover:text-foreground transition-colors">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={([v]) => { setVolume(v); setIsMuted(false); }}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-[10px] text-muted-foreground font-mono w-7 text-right">
                      {isMuted ? 0 : volume}%
                    </span>
                  </div>
                )}

                {!activeAmbient && (
                  <p className="px-4 pb-4 text-xs text-muted-foreground text-center">
                    Tap a sound to create your study ambience 🌙
                  </p>
                )}
              </>
            ) : (
              <>
                {/* Playlist grid */}
                <div className="p-3 grid grid-cols-2 gap-2">
                  {PLAYLISTS.map((pl) => (
                    <button
                      key={pl.spotifyUri}
                      onClick={() => setActivePlaylist(pl)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                        activePlaylist?.spotifyUri === pl.spotifyUri
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary border border-transparent'
                      }`}
                    >
                      <span className="text-base">{pl.emoji}</span>
                      <span className="truncate">{pl.label}</span>
                    </button>
                  ))}
                </div>

                {activePlaylist && (
                  <div className="px-3 pb-3">
                    <iframe
                      key={activePlaylist.spotifyUri}
                      src={`https://open.spotify.com/embed/playlist/${activePlaylist.spotifyUri}?utm_source=generator&theme=0`}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-xl"
                      title={activePlaylist.label}
                    />
                  </div>
                )}

                {!activePlaylist && (
                  <p className="px-4 pb-4 text-xs text-muted-foreground text-center">
                    Pick a vibe to start studying 🎶
                  </p>
                )}
              </>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full gradient-primary shadow-elevated flex items-center justify-center glow-primary"
          >
            {isPlaying ? (
              <ChevronUp className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Music className="w-5 h-5 text-primary-foreground" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
