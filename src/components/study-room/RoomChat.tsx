import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  display_name: string;
  message: string;
  created_at: string;
}

interface RoomChatProps {
  roomId: string;
}

export default function RoomChat({ roomId }: RoomChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [displayName, setDisplayName] = useState('Student');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load display name
  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('display_name').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
        else setDisplayName(user.email?.split('@')[0] || 'Student');
      });
  }, [user]);

  // Load messages + subscribe
  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from('room_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100);
      if (data) setMessages(data as ChatMessage[]);
    };
    loadMessages();

    const channel = supabase
      .channel(`chat-${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'room_messages',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        setMessages(prev => [...prev.slice(-99), payload.new as ChatMessage]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !user) return;
    const msg = input.trim();
    setInput('');
    await supabase.from('room_messages').insert({
      room_id: roomId,
      user_id: user.id,
      display_name: displayName,
      message: msg,
    });
  }, [input, user, roomId, displayName]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="glass-panel-light rounded-2xl border border-border/20 p-3 flex flex-col" style={{ maxHeight: '320px' }}>
      <h4 className="text-[10px] text-muted-foreground mb-2 font-medium flex items-center gap-1.5">
        <MessageCircle className="w-3 h-3" /> Room Chat
      </h4>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 mb-2 min-h-[80px] max-h-[200px] pr-1">
        {messages.length === 0 && (
          <p className="text-[10px] text-muted-foreground/60 text-center py-4">No messages yet — say hi! 👋</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.user_id === user?.id;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[9px] text-muted-foreground/60 mb-0.5 px-1">
                {msg.display_name}
              </span>
              <div className={`px-2.5 py-1.5 rounded-xl text-[11px] leading-tight max-w-[85%] ${
                isMe
                  ? 'bg-primary/15 text-foreground border border-primary/20'
                  : 'bg-secondary/30 text-foreground border border-border/20'
              }`}>
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex gap-1.5">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-2.5 py-1.5 rounded-xl bg-secondary/20 border border-border/20 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="p-1.5 rounded-xl bg-primary/15 text-primary hover:bg-primary/25 transition-colors disabled:opacity-30"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
