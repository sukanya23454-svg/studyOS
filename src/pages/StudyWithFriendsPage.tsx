import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, LogIn, Copy, Clock, LogOut, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudyRoom {
  id: string;
  name: string;
  invite_code: string;
  host_id: string;
  timer_duration: number;
  timer_started_at: string | null;
  timer_remaining: number | null;
  created_at: string;
}

interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  display_name: string;
  status: string;
  joined_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  studying: 'bg-green-500',
  break: 'bg-amber-500',
  idle: 'bg-muted-foreground',
};

const STATUS_LABELS: Record<string, string> = {
  studying: '📖 Studying',
  break: '☕ Break',
  idle: '💤 Idle',
};

export default function StudyWithFriendsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<'lobby' | 'room'>('lobby');
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState<StudyRoom | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [myStatus, setMyStatus] = useState<string>('studying');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch display name
  const getDisplayName = useCallback(async () => {
    if (!user) return 'Student';
    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .single();
    return data?.display_name || user.email?.split('@')[0] || 'Student';
  }, [user]);

  // Create room
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

    // Join the room as host
    await supabase.from('room_members').insert({
      room_id: room.id,
      user_id: user.id,
      display_name: displayName,
      status: 'studying',
    });

    setCurrentRoom(room as StudyRoom);
    setView('room');
    setLoading(false);
  };

  // Join room by code
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
      toast({ title: 'Room not found', description: 'Check your invite code and try again', variant: 'destructive' });
      setLoading(false);
      return;
    }

    await supabase.from('room_members').upsert({
      room_id: room.id,
      user_id: user.id,
      display_name: displayName,
      status: 'studying',
    }, { onConflict: 'room_id,user_id' });

    setCurrentRoom(room as StudyRoom);
    setView('room');
    setLoading(false);
  };

  // Leave room
  const leaveRoom = async () => {
    if (!user || !currentRoom) return;
    await supabase.from('room_members').delete().eq('room_id', currentRoom.id).eq('user_id', user.id);
    setCurrentRoom(null);
    setView('lobby');
    setMembers([]);
  };

  // Update status
  const updateStatus = async (status: string) => {
    if (!user || !currentRoom) return;
    setMyStatus(status);
    await supabase.from('room_members').update({ status }).eq('room_id', currentRoom.id).eq('user_id', user.id);
  };

  // Start/stop timer (host only)
  const toggleTimer = async () => {
    if (!currentRoom || !user || currentRoom.host_id !== user.id) return;
    if (currentRoom.timer_started_at) {
      // Stop
      await supabase.from('study_rooms').update({ timer_started_at: null, timer_remaining: timerSeconds }).eq('id', currentRoom.id);
    } else {
      // Start
      await supabase.from('study_rooms').update({ timer_started_at: new Date().toISOString(), timer_remaining: currentRoom.timer_duration }).eq('id', currentRoom.id);
    }
  };

  // Copy invite code
  const copyCode = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Realtime subscriptions for room
  useEffect(() => {
    if (!currentRoom) return;

    // Load members
    const loadMembers = async () => {
      const { data } = await supabase.from('room_members').select().eq('room_id', currentRoom.id);
      if (data) setMembers(data as RoomMember[]);
    };
    loadMembers();

    const channel = supabase
      .channel(`room-${currentRoom.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_members', filter: `room_id=eq.${currentRoom.id}` }, () => {
        loadMembers();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'study_rooms', filter: `id=eq.${currentRoom.id}` }, (payload) => {
        setCurrentRoom(payload.new as StudyRoom);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentRoom?.id]);

  // Timer countdown
  useEffect(() => {
    if (!currentRoom?.timer_started_at) {
      setTimerSeconds(currentRoom?.timer_remaining || currentRoom?.timer_duration || 1500);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(currentRoom.timer_started_at!).getTime()) / 1000);
      const remaining = Math.max(0, (currentRoom.timer_remaining || currentRoom.timer_duration) - elapsed);
      setTimerSeconds(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRoom?.timer_started_at, currentRoom?.timer_remaining, currentRoom?.timer_duration]);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const isHost = currentRoom?.host_id === user?.id;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="w-7 h-7 text-primary" />
          Study With Friends
        </h1>
        <p className="text-muted-foreground mt-1">Create or join a shared study room</p>
      </div>

      <AnimatePresence mode="wait">
        {view === 'lobby' ? (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Create Room */}
            <div className="gradient-card rounded-2xl border border-border p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-display font-semibold">Create a Room</h2>
              </div>
              <p className="text-sm text-muted-foreground">Start a study session and invite friends to join.</p>
              <Input
                placeholder="Room name (e.g., Chemistry Grind)"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                className="bg-secondary/60 border-border"
              />
              <Button
                onClick={createRoom}
                disabled={!roomName.trim() || loading}
                className="w-full gradient-primary text-primary-foreground glow-primary"
              >
                <Plus className="w-4 h-4" />
                Create Room
              </Button>
            </div>

            {/* Join Room */}
            <div className="gradient-card rounded-2xl border border-border p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-display font-semibold">Join a Room</h2>
              </div>
              <p className="text-sm text-muted-foreground">Enter a room code from a friend to start studying together.</p>
              <Input
                placeholder="Enter invite code"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                className="bg-secondary/60 border-border"
              />
              <Button
                onClick={joinRoom}
                disabled={!joinCode.trim() || loading}
                variant="outline"
                className="w-full"
              >
                <LogIn className="w-4 h-4" />
                Join Room
              </Button>
            </div>
          </motion.div>
        ) : currentRoom ? (
          <motion.div
            key="room"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-6"
          >
            {/* Room header */}
            <div className="gradient-card rounded-2xl border border-border p-6 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-display font-bold">{currentRoom.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{members.length} studying</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={copyCode} className="gap-1.5">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : currentRoom.invite_code}
                  </Button>
                  <Button variant="outline" size="sm" onClick={leaveRoom} className="text-destructive gap-1.5">
                    <LogOut className="w-3.5 h-3.5" />
                    Leave
                  </Button>
                </div>
              </div>
            </div>

            {/* Shared Timer */}
            <div className="gradient-card rounded-2xl border border-border p-6 shadow-card text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold">Shared Focus Timer</h3>
              </div>
              <p className="text-5xl font-mono font-bold text-foreground tracking-wider mb-4">
                {formatTimer(timerSeconds)}
              </p>
              {isHost ? (
                <Button onClick={toggleTimer} className="gradient-primary text-primary-foreground glow-primary">
                  {currentRoom.timer_started_at ? 'Pause Timer' : 'Start Timer'}
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground">Timer is controlled by the host</p>
              )}
            </div>

            {/* Status selector */}
            <div className="gradient-card rounded-2xl border border-border p-5 shadow-card">
              <h3 className="font-display font-semibold mb-3 text-sm">Your Status</h3>
              <div className="flex gap-2">
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => updateStatus(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      myStatus === key
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-transparent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Members */}
            <div className="gradient-card rounded-2xl border border-border p-5 shadow-card">
              <h3 className="font-display font-semibold mb-3">Study Buddies</h3>
              <div className="space-y-2">
                {members.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40"
                  >
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {m.display_name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {m.display_name}
                        {m.user_id === currentRoom.host_id && <span className="text-xs text-primary ml-1.5">👑 Host</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[m.status] || 'bg-muted'}`} />
                      <span className="text-xs text-muted-foreground capitalize">{m.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
