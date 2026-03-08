import { useState, useEffect, useRef, useCallback } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { TIMER_PRESETS, type TimerMode } from '@/lib/types';
import { formatTimerDisplay } from '@/lib/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RoomTimerProps {
  /** If in a shared room, sync timer from host */
  sharedTimer?: {
    seconds: number;
    isRunning: boolean;
    isHost: boolean;
    onToggle: () => void;
  };
}

export default function RoomTimer({ sharedTimer }: RoomTimerProps) {
  const { subjects, addSession } = useStudy();
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const preset = TIMER_PRESETS.find(p => p.mode === mode)!;
  const focusMinutes = preset.focusMinutes;
  const breakMinutes = preset.breakMinutes;

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setElapsed(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(mode === 'flow' ? 0 : focusMinutes * 60);
  }, [mode, focusMinutes]);

  useEffect(() => { resetTimer(); }, [mode, resetTimer]);

  useEffect(() => {
    if (sharedTimer) return; // shared timer controls externally
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      if (mode === 'flow') {
        setElapsed(p => p + 1);
        setTimeLeft(p => p + 1);
      } else {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (!isBreak && breakMinutes > 0) {
              setIsBreak(true);
              toast.success('Focus done! Break time 🎉');
              return breakMinutes * 60;
            } else {
              setIsRunning(false);
              toast.success('Session finished! 💪');
              return 0;
            }
          }
          setElapsed(e => e + 1);
          return prev - 1;
        });
      }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isBreak, mode, breakMinutes, sharedTimer]);

  const finishSession = () => {
    if (elapsed < 10) return;
    const xp = addSession({
      subjectId: selectedSubject || undefined,
      mode,
      duration: elapsed,
      date: new Date().toISOString(),
    });
    toast.success(`+${xp} XP earned 🏆`);
    resetTimer();
  };

  const displaySeconds = sharedTimer ? sharedTimer.seconds : timeLeft;
  const displayRunning = sharedTimer ? sharedTimer.isRunning : isRunning;
  const totalSeconds = mode === 'flow' ? 0 : focusMinutes * 60;
  const progress = mode === 'flow' ? 0 : totalSeconds > 0 ? ((totalSeconds - displaySeconds) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="glass-panel rounded-2xl border border-border/30 p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-2"
      >
        <h3 className="font-display font-semibold text-sm flex items-center gap-2">
          ⏱️ Focus Timer
          {displayRunning && <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />}
        </h3>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {/* Compact timer display */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-[120px] h-[120px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--secondary)/0.3)" strokeWidth="4" />
            {mode !== 'flow' && (
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="4" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-[10px] font-medium uppercase tracking-wider mb-0.5 ${isBreak ? 'text-success' : 'text-primary'}`}>
              {isBreak ? 'Break' : mode === 'flow' ? 'Flow' : 'Focus'}
            </span>
            <span className="text-xl font-mono font-bold text-foreground">
              {formatTimerDisplay(displaySeconds)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!sharedTimer && (
            <Button variant="ghost" size="icon" onClick={resetTimer} className="w-8 h-8 rounded-full">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          )}
          {sharedTimer ? (
            sharedTimer.isHost ? (
              <Button
                onClick={sharedTimer.onToggle}
                size="sm"
                className={`rounded-full text-xs ${displayRunning ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'gradient-primary text-primary-foreground'}`}
              >
                {displayRunning ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                {displayRunning ? 'Pause' : 'Start'}
              </Button>
            ) : (
              <span className="text-[10px] text-muted-foreground">Host controls timer</span>
            )
          ) : (
            <Button
              onClick={() => setIsRunning(!isRunning)}
              size="sm"
              className={`rounded-full text-xs ${isRunning ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'gradient-primary text-primary-foreground'}`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
          )}
          {!sharedTimer && (
            <Button variant="ghost" size="icon" onClick={finishSession} className="w-8 h-8 rounded-full" disabled={elapsed < 10}>
              <Check className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded: mode selector & subject */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border/30 space-y-3">
              {!sharedTimer && (
                <div className="grid grid-cols-3 gap-1.5">
                  {TIMER_PRESETS.filter(p => p.mode !== 'custom').map(p => (
                    <button
                      key={p.mode}
                      onClick={() => { if (!isRunning) setMode(p.mode); }}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                        mode === p.mode
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50 border border-transparent'
                      } ${isRunning ? 'opacity-50' : ''}`}
                    >
                      {p.icon} {p.label}
                    </button>
                  ))}
                </div>
              )}
              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {subjects.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSubject(selectedSubject === s.id ? '' : s.id)}
                      className={`px-2 py-1 rounded-md text-[10px] border transition-colors ${
                        selectedSubject === s.id ? 'border-primary/30 bg-primary/10 text-primary' : 'border-transparent bg-secondary/30 text-muted-foreground'
                      }`}
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: s.color }} />
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
