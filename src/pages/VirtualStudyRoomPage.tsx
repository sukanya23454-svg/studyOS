import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Search, User, Users, ArrowLeft,
} from 'lucide-react';
import { ENVIRONMENTS, useEnvironment } from '@/contexts/EnvironmentContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import RoomTimer from '@/components/study-room/RoomTimer';
import RoomNotes from '@/components/study-room/RoomNotes';
import RoomTasks from '@/components/study-room/RoomTasks';
import RoomAI from '@/components/study-room/RoomAI';
import FriendsPanel from '@/components/study-room/FriendsPanel';

type View = 'picker' | 'mode-select' | 'alone' | 'friends';

export default function VirtualStudyRoomPage() {
  const { activeEnvironment, setEnvironment } = useEnvironment();
  const [view, setView] = useState<View>(activeEnvironment ? 'mode-select' : 'picker');
  const [search, setSearch] = useState('');

  const filtered = ENVIRONMENTS.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectEnvironment = (env: typeof ENVIRONMENTS[0]) => {
    setEnvironment(env);
    setView('mode-select');
  };

  const goBack = () => {
    if (view === 'mode-select') { setEnvironment(null); setView('picker'); }
    else if (view === 'alone' || view === 'friends') { setView('mode-select'); }
  };

  // ─── In-room layout (alone or friends) ───
  const renderRoom = () => (
    <motion.div
      key="room"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
    >
      {/* Left: Main tools */}
      <div className="lg:col-span-2 space-y-4">
        {/* Room header */}
        <div className="glass-panel rounded-2xl border border-border/30 p-4 flex items-center gap-3">
          <span className="text-2xl">{activeEnvironment?.emoji}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-display font-bold truncate">{activeEnvironment?.name}</h2>
            <p className="text-xs text-muted-foreground">{activeEnvironment?.description}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-muted-foreground">
              {view === 'friends' ? 'Shared Room' : 'Focus Mode'}
            </span>
          </div>
        </div>

        {/* Timer (solo mode) */}
        {view === 'alone' && <RoomTimer />}

        {/* Tasks */}
        <RoomTasks />

        {/* Notes */}
        <RoomNotes />

        {/* AI */}
        <RoomAI />
      </div>

      {/* Right sidebar: Friends panel or solo info */}
      <div className="space-y-4">
        {view === 'friends' ? (
          <FriendsPanel onLeave={() => setView('mode-select')} />
        ) : (
          <div className="glass-panel rounded-2xl border border-border/30 p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">Studying solo</p>
            <button
              onClick={() => setView('friends')}
              className="text-xs text-primary hover:underline flex items-center gap-1 mx-auto"
            >
              <Users className="w-3 h-3" /> Switch to Study With Friends
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {view !== 'picker' && (
          <button onClick={goBack} className="glass-panel p-2 rounded-xl border border-border/30 hover:border-primary/40 transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-primary" />
            Virtual Study Room
          </h1>
          <p className="text-muted-foreground mt-1">
            {view === 'picker' && 'Choose your immersive study environment'}
            {view === 'mode-select' && `${activeEnvironment?.emoji} ${activeEnvironment?.name} — Choose your study mode`}
            {(view === 'alone' || view === 'friends') && `${activeEnvironment?.emoji} Studying in ${activeEnvironment?.name}`}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ─── ENVIRONMENT PICKER ─── */}
        {view === 'picker' && (
          <motion.div key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search environments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl glass-panel border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((env, i) => (
                <motion.button
                  key={env.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => selectEnvironment(env)}
                  className="group relative rounded-xl overflow-hidden border border-border/50 hover:border-primary/40 transition-all text-left"
                >
                  <div className="aspect-[4/3] relative" style={{ background: env.gradient }}>
                    <div className="absolute inset-0 opacity-60"><AnimatedBackground type={env.animation} /></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{env.emoji}</span>
                        <h3 className="text-xs font-display font-semibold text-white leading-tight">{env.name}</h3>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No environments found</p>}
          </motion.div>
        )}

        {/* ─── MODE SELECT ─── */}
        {view === 'mode-select' && (
          <motion.div key="mode" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <button
              onClick={() => setView('alone')}
              className="glass-panel rounded-2xl border border-border/30 p-8 text-left hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-display font-bold mb-1">Study Alone</h2>
              <p className="text-sm text-muted-foreground">Private focus session — just you and the ambience.</p>
            </button>
            <button
              onClick={() => setView('friends')}
              className="glass-panel rounded-2xl border border-border/30 p-8 text-left hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <h2 className="text-lg font-display font-bold mb-1">Study With Friends</h2>
              <p className="text-sm text-muted-foreground">Create a shared room and focus together.</p>
            </button>
          </motion.div>
        )}

        {/* ─── ROOM (alone or friends) ─── */}
        {(view === 'alone' || view === 'friends') && renderRoom()}
      </AnimatePresence>
    </div>
  );
}
