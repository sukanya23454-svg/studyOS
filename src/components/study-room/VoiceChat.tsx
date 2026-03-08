import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceChatProps {
  members: Array<{ id: string; display_name: string; user_id: string }>;
  currentUserId?: string;
}

export default function VoiceChat({ members, currentUserId }: VoiceChatProps) {
  const [expanded, setExpanded] = useState(true);
  const [micEnabled, setMicEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number>(0);

  const toggleMic = useCallback(async () => {
    if (micEnabled) {
      // Stop
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (animRef.current) cancelAnimationFrame(animRef.current);
      analyserRef.current = null;
      setMicEnabled(false);
      setSpeaking(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setSpeaking(avg > 25);
        animRef.current = requestAnimationFrame(checkLevel);
      };
      checkLevel();
      setMicEnabled(true);
    } catch {
      toast.error('Microphone access denied');
    }
  }, [micEnabled]);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="glass-panel rounded-2xl border border-border/30 p-4">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between mb-1">
        <h3 className="font-display font-semibold text-sm flex items-center gap-2">
          🎙️ Voice Chat
          {micEnabled && <span className={`w-1.5 h-1.5 rounded-full ${speaking ? 'bg-success animate-pulse' : 'bg-primary'}`} />}
        </h3>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 border-t border-border/30 space-y-3">
              {/* Mic toggle */}
              <div className="flex items-center justify-center">
                <Button
                  onClick={toggleMic}
                  size="sm"
                  className={`rounded-full gap-1.5 text-xs ${
                    micEnabled
                      ? speaking
                        ? 'bg-success/20 text-success border border-success/40 hover:bg-success/30'
                        : 'bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20'
                      : 'bg-secondary/40 text-muted-foreground border border-border/30 hover:bg-secondary/60'
                  }`}
                  variant="ghost"
                >
                  {micEnabled ? (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      {speaking ? 'Speaking...' : 'Mic On'}
                    </>
                  ) : (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      Mic Off
                    </>
                  )}
                </Button>
              </div>

              {/* Members in voice */}
              <div className="space-y-1">
                {members.map(m => {
                  const isMe = m.user_id === currentUserId;
                  const isSpeakingNow = isMe && speaking;
                  return (
                    <div key={m.id} className="flex items-center gap-2 px-2 py-1 rounded-lg">
                      <div className={`w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground ring-2 transition-all ${
                        isSpeakingNow ? 'ring-success ring-offset-1 ring-offset-background' : 'ring-transparent'
                      }`}>
                        {m.display_name[0]?.toUpperCase()}
                      </div>
                      <span className="text-xs text-foreground flex-1">{m.display_name}{isMe && ' (You)'}</span>
                      {isSpeakingNow && <Volume2 className="w-3 h-3 text-success animate-pulse" />}
                    </div>
                  );
                })}
              </div>

              <p className="text-[9px] text-muted-foreground text-center">
                Voice is local only in this preview
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
