import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, LogIn, Copy, Check, LogOut, Clock,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import VoiceChat from './VoiceChat';
import RoomTimer from './RoomTimer';

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

const STATUS_LABELS: Record<string, string> = {
  studying: '📖 Studying',
  break: '☕ Break',
  idle: '💤 Idle',
};

const STATUS_COLORS: Record<string, string> = {
  studying: 'bg-success',
  break: 'bg-accent',
  idle: 'bg-muted-foreground',
};

interface FriendsPanelProps {
  onLeave: () => void;
}

export default function FriendsPanel({ onLeave }: FriendsPanelProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<'lobby' | 'room'>('lobby');
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState<StudyRoom | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [myStatus, setMyStatus] = useState('studying');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDisplayName = useCallback(async () => {
    if (!user) return 'Student';
    const { data } = await supabase.from('profiles').select('display_name').eq('user_id', user.id).single();
    return data?.display_name || user.email?.split('@')[0] || 'Student';
  }, [user]);

  const createRoom = async () => {
    if (!user || !roomName.trim()) return;
    setLoading(true);
    const displayName = await getDisplayName();
    const { data: room, error } = await supabase.from('study_rooms').insert({ name: roomName.trim(), host_id: user.id }).select().single();
    if (error || !room) { toast({ title: 'Error', description: 'Failed to create room', variant: 'destructive' }); setLoading(false); return; }
    await supabase.from('room_members').insert({ room_id: room.id, user_id: user.id, display_name: displayName, status: 'studying' });
    setCurrentRoom(room as StudyRoom);
    setView('room');
    setLoading(false);
  };

  const joinRoom = async () => {
    if (!user || !joinCode.trim()) return;
    setLoading(true);
    const displayName = await getDisplayName();
    const { data: room, error } = await supabase.from('study_rooms').select().eq('invite_code', joinCode.trim()).single();
    if (error || !room) { toast({ title: 'Not found', description: 'Check invite code', variant: 'destructive' }); setLoading(false); return; }
    await supabase.from('room_members').upsert({ room_id: room.id, user_id: user.id, display_name: displayName, status: 'studying' }, { onConflict: 'room_id,user_id' });
    setCurrentRoom(room as StudyRoom);
    setView('room');
    setLoading(false);
  };

  const leaveRoom = async () => {
    if (user && currentRoom) {
      await supabase.from('room_members').delete().eq('room_id', currentRoom.id).eq('user_id', user.id);
    }
    setCurrentRoom(null);
    setMembers([]);
    setView('lobby');
    onLeave();
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

  const isHost = currentRoom?.host_id === user?.id;

  if (view === 'lobby') {
    return (
      <div className="space-y-3">
        <div className="glass-panel rounded-2xl border border-border/30 p-4 space-y-3">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Create Room
          </h3>
          <Input placeholder="Room name" value={roomName} onChange={e => setRoomName(e.target.value)} className="bg-secondary/40 border-border/30 text-xs h-8" />
          <Button onClick={createRoom} disabled={!roomName.trim() || loading} size="sm" className="w-full text-xs h-7 gradient-primary text-primary-foreground">
            <Plus className="w-3 h-3 mr-1" /> Create
          </Button>
        </div>
        <div className="glass-panel rounded-2xl border border-border/30 p-4 space-y-3">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2">
            <LogIn className="w-4 h-4 text-accent" /> Join Room
          </h3>
          <Input placeholder="Invite code" value={joinCode} onChange={e => setJoinCode(e.target.value)} className="bg-secondary/40 border-border/30 text-xs h-8" />
          <Button onClick={joinRoom} disabled={!joinCode.trim() || loading} size="sm" variant="outline" className="w-full text-xs h-7">
            <LogIn className="w-3 h-3 mr-1" /> Join
          </Button>
        </div>
      </div>
    );
  }

  if (!currentRoom) return null;

  return (
    <div className="space-y-3">
      {/* Room header */}
      <div className="glass-panel rounded-2xl border border-border/30 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-display font-bold truncate">{currentRoom.name}</h3>
            <p className="text-[10px] text-muted-foreground">{members.length} studying</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="ghost" size="sm"
              onClick={() => { navigator.clipboard.writeText(currentRoom.invite_code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="h-6 px-2 text-[10px] gap-1"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : currentRoom.invite_code}
            </Button>
            <Button variant="ghost" size="sm" onClick={leaveRoom} className="h-6 px-2 text-[10px] text-destructive gap-1">
              <LogOut className="w-3 h-3" /> Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Shared timer */}
      <RoomTimer sharedTimer={{
        seconds: timerSeconds,
        isRunning: !!currentRoom.timer_started_at,
        isHost,
        onToggle: toggleTimer,
      }} />

      {/* Status */}
      <div className="glass-panel rounded-2xl border border-border/30 p-3">
        <h4 className="text-[10px] text-muted-foreground mb-2 font-medium">Your Status</h4>
        <div className="flex gap-1.5">
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => updateStatus(key)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                myStatus === key ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-secondary/30 text-muted-foreground border border-transparent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Members */}
      <div className="glass-panel rounded-2xl border border-border/30 p-3">
        <h4 className="text-[10px] text-muted-foreground mb-2 font-medium">Study Buddies</h4>
        <div className="space-y-1">
          {members.map(m => (
            <div key={m.id} className="flex items-center gap-2 p-1">
              <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                {m.display_name[0]?.toUpperCase()}
              </div>
              <span className="text-xs flex-1 truncate">
                {m.display_name}
                {m.user_id === currentRoom.host_id && <span className="text-primary ml-1">👑</span>}
              </span>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[m.status] || 'bg-muted'}`} />
                <span className="text-[9px] text-muted-foreground capitalize">{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Chat */}
      <VoiceChat members={members} currentUserId={user?.id} />
    </div>
  );
}
