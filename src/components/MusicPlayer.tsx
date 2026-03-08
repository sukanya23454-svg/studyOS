import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, ChevronUp } from 'lucide-react';

const PLAYLISTS = [
  {
    label: 'Lo-fi Beats',
    emoji: '🎧',
    spotifyUri: '0vvXsWCC9xrXsKd4FyS8kM', // lofi beats
  },
  {
    label: 'Soft Jazz',
    emoji: '🎷',
    spotifyUri: '37i9dQZF1DWV7EzJMK2FUI', // jazz vibes
  },
  {
    label: 'Piano Focus',
    emoji: '🎹',
    spotifyUri: '37i9dQZF1DX4sWSpwq3LiO', // peaceful piano
  },
  {
    label: 'Classical Focus',
    emoji: '🎻',
    spotifyUri: '37i9dQZF1DWWEJlAGA9gs0', // classical focus
  },
  {
    label: 'Ambient Focus',
    emoji: '🌙',
    spotifyUri: '37i9dQZF1DX3Ogo9pFvBkY', // ambient focus
  },
  {
    label: 'Deep Focus',
    emoji: '🧠',
    spotifyUri: '37i9dQZF1DWZeKCadgRdKQ', // deep focus
  },
];

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState<typeof PLAYLISTS[0] | null>(null);

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
                <span className="font-display text-sm font-semibold">Focus Music</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

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

            {/* Spotify Embed */}
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
            {activePlaylist ? (
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
