import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, Sparkles, Search, User, Users, Plus, LogIn, Copy,
  Clock, LogOut, ArrowLeft,
} from 'lucide-react';
import { ENVIRONMENTS, useEnvironment } from '@/contexts/EnvironmentContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// ─── Types ───
interface StudyRoom {
  id: string;
  name: string;
  invite_code: string;
  host_id: string;
  timer_duration: number;
  timer_started_at: string | null;
  timer_remaining: number | null;
}

interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  display_name: string;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  studying: 'bg-success',
  break: 'bg-accent',
  idle: 'bg-muted-foreground',
};

const STATUS_LABELS: Record<string, string> = {
  studying: '📖 Studying',
  break: '☕ Break',
  idle: '💤 Idle',
};

// ─── Sub-views ───
type View = 'picker' | 'mode-select' | 'alone' | 'friends-lobby' | 'friends-room';

export default function VirtualStudyRoomPage() {
  const { activeEnvironment, setEnvironment } = useEnvironment();
  const { user } = useAuth();
  const { toast } = useToast();

  const [view, setView] = useState<View>(activeEnvironment ? 'mode-select' : 'picker');
  const [search, setSearch] = useState('');

  // Friends state
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState<StudyRoom | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [myStatus, setMyStatus] = useState('studying');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const filtered = ENVIRONMENTS.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Helpers ───
  const getDisplayName = useCallback(async () => {
    if (!user) return 'Student';
    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .single();
    return data?.display_name || user.email?.split('@')[0] || 'Student';
  }, [user]);

  const selectEnvironment = (env: typeof ENVIRONMENTS[0]) => {
    setEnvironment(env);
    setView('mode-select');
  };

  const goBack = () => {
    if (view === 'mode-select') {
      setEnvironment(null);
      setView('picker');
    } else if (view === 'alone') {
      setView('mode-select');
    } else if (view === 'friends-lobby') {
      setView('mode-select');
    } else if (view === 'friends-room') {
      leaveRoom();
    }
  };

  // ─── Friends logic ───
  const createRoom = async () => {
    if (!user || !roomName.trim()) return;
    setLoading(true);
    const displayName = await getDisplayName();
    const { data: room, error } = await supabase
      .from('study_rooms')
      .insert({ name: roomName.trim(), host_id: user.id })
      .select()
      .single();
    if (error || !room) {
      toast({ title: 'Error', description: 'Failed to create room', variant: 'destructive' });
      setLoading(false);
      return;
    }
    await supabase.from('room_members').insert({
      room_id: room.id, user_id: user.id, display_name: displayName, status: 'studying',
    });
    setCurrentRoom(room as StudyRoom);
    setView('friends-room');
    setLoading(false);
  };

  const joinRoom = async () => {
    if (!user || !joinCode.trim()) return;
    setLoading(true);
    const displayName = await getDisplayName();
    const { data: room, error } = await supabase
      .from('study_rooms')
      .select()
      .eq('invite_code', joinCode.trim())
      .single();
    if (error || !room) {
      toast({ title: 'Room not found', description: 'Check your invite code', variant: 'destructive' });
      setLoading(false);
      return;
    }
    await supabase.from('room_members').upsert({
      room_id: room.id, user_id: user.id, display_name: displayName, status: 'studying',
    }, { onConflict: 'room_id,user_id' });
    setCurrentRoom(room as StudyRoom);
    setView('friends-room');
    setLoading(false);
  };

  const leaveRoom = async () => {
    if (user && currentRoom) {
      await supabase.from('room_members').delete().eq('room_id', currentRoom.id).eq('user_id', user.id);
    }
    setCurrentRoom(null);
    setMembers([]);
    setView('friends-lobby');
  };

  const updateStatus = async (status: string) => {
    if (!user || !currentRoom) return;
    setMyStatus(status);
    await supabase.from('room_members').update({ status }).eq('room_id', currentRoom.id).eq('user_id', user.id);
  };

  const toggleTimer = async () => {
    if (!currentRoom || !user || currentRoom.host_id !== user.id) return;
    if (currentRoom.timer_started_at) {
      await supabase.from('study_rooms').update({ timer_started_at: null, timer_remaining: timerSeconds }).eq('id', currentRoom.id);
    } else {
      await supabase.from('study_rooms').update({ timer_started_at: new Date().toISOString(), timer_remaining: currentRoom.timer_duration }).eq('id', currentRoom.id);
    }
  };

  const copyCode = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Realtime
  useEffect(() => {
    if (!currentRoom) return;
    const loadMembers = async () => {
      const { data } = await supabase.from('room_members').select().eq('room_id', currentRoom.id);
      if (data) setMembers(data as RoomMember[]);
    };
    loadMembers();
    const channel = supabase
      .channel(`room-${currentRoom.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_members', filter: `room_id=eq.${currentRoom.id}` }, () => loadMembers())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'study_rooms', filter: `id=eq.${currentRoom.id}` }, (payload) => setCurrentRoom(payload.new as StudyRoom))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentRoom?.id]);

  // Timer
  useEffect(() => {
    if (!currentRoom?.timer_started_at) {
      setTimerSeconds(currentRoom?.timer_remaining || currentRoom?.timer_duration || 1500);
      return;
    }
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(currentRoom.timer_started_at!).getTime()) / 1000);
      setTimerSeconds(Math.max(0, (currentRoom.timer_remaining || currentRoom.timer_duration) - elapsed));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentRoom?.timer_started_at, currentRoom?.timer_remaining, currentRoom?.timer_duration]);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const isHost = currentRoom?.host_id === user?.id;

  // ─── Render ───
  return (
    <div className="space-y-6">
      {/* Header with back button */}
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
            {view === 'alone' && `${activeEnvironment?.emoji} Focus session in ${activeEnvironment?.name}`}
            {view === 'friends-lobby' && 'Create or join a study room with friends'}
            {view === 'friends-room' && `${activeEnvironment?.emoji} Studying in ${activeEnvironment?.name}`}
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
                onChange={(e) => setSearch(e.target.value)}
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
              onClick={() => setView('friends-lobby')}
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

        {/* ─── STUDY ALONE ─── */}
        {view === 'alone' && (
          <motion.div key="alone" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 max-w-lg">
            <div className="glass-panel rounded-2xl border border-border/30 p-6 text-center">
              <p className="text-5xl mb-3">{activeEnvironment?.emoji}</p>
              <h2 className="text-xl font-display font-bold">{activeEnvironment?.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{activeEnvironment?.description}</p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">You're in focus mode</span>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Use the sidebar to access Timer, Notes, AI Assistant, and more while immersed in your environment.
            </p>
          </motion.div>
        )}

        {/* ─── FRIENDS LOBBY ─── */}
        {view === 'friends-lobby' && (
          <motion.div key="lobby" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="glass-panel rounded-2xl border border-border/30 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-display font-semibold">Create a Room</h2>
              </div>
              <p className="text-sm text-muted-foreground">Start a study session and invite friends.</p>
              <Input
                placeholder="Room name (e.g., Chemistry Grind)"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                className="bg-secondary/40 border-border/30"
              />
              <Button onClick={createRoom} disabled={!roomName.trim() || loading} className="w-full gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4" /> Create Room
              </Button>
            </div>
            <div className="glass-panel rounded-2xl border border-border/30 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-display font-semibold">Join a Room</h2>
              </div>
              <p className="text-sm text-muted-foreground">Enter an invite code to study together.</p>
              <Input
                placeholder="Enter invite code"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                className="bg-secondary/40 border-border/30"
              />
              <Button onClick={joinRoom} disabled={!joinCode.trim() || loading} variant="outline" className="w-full">
                <LogIn className="w-4 h-4" /> Join Room
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── FRIENDS ROOM ─── */}
        {view === 'friends-room' && currentRoom && (
          <motion.div key="room" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 max-w-2xl">
            {/* Room header */}
            <div className="glass-panel rounded-2xl border border-border/30 p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-display font-bold">{currentRoom.name}</h2>
                  <p className="text-sm text-muted-foreground">{members.length} studying · {activeEnvironment?.emoji} {activeEnvironment?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={copyCode} className="gap-1.5 glass-panel border-border/30">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : currentRoom.invite_code}
                  </Button>
                  <Button variant="outline" size="sm" onClick={leaveRoom} className="text-destructive gap-1.5 glass-panel border-border/30">
                    <LogOut className="w-3.5 h-3.5" /> Leave
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shared Timer */}
              <div className="glass-panel rounded-2xl border border-border/30 p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-sm">Shared Focus Timer</h3>
                </div>
                <p className="text-4xl font-mono font-bold text-foreground tracking-wider mb-4">
                  {formatTimer(timerSeconds)}
                </p>
                {isHost ? (
                  <Button onClick={toggleTimer} size="sm" className="gradient-primary text-primary-foreground">
                    {currentRoom.timer_started_at ? 'Pause' : 'Start'}
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground">Host controls the timer</p>
                )}
              </div>

              {/* Status */}
              <div className="glass-panel rounded-2xl border border-border/30 p-5">
                <h3 className="font-display font-semibold mb-3 text-sm">Your Status</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        myStatus === key
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-secondary/30 text-secondary-foreground hover:bg-secondary/50 border border-transparent'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="glass-panel rounded-2xl border border-border/30 p-5">
              <h3 className="font-display font-semibold mb-3 text-sm">Study Buddies</h3>
              <div className="flex flex-wrap gap-3">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 bg-secondary/20 rounded-xl px-3 py-2">
                    <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {m.display_name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-medium">
                        {m.display_name}
                        {m.user_id === currentRoom.host_id && <span className="text-primary ml-1">👑</span>}
                      </p>
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[m.status] || 'bg-muted'}`} />
                        <span className="text-[10px] text-muted-foreground capitalize">{m.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
