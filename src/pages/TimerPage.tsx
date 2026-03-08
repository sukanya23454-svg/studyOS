import { useState, useEffect, useRef, useCallback } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { TIMER_PRESETS, type TimerMode } from '@/lib/types';
import { formatTimerDisplay } from '@/lib/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TimerPage() {
  const { subjects, addSession } = useStudyData();
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [customFocus, setCustomFocus] = useState(45);
  const [customBreak, setCustomBreak] = useState(10);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const preset = TIMER_PRESETS.find(p => p.mode === mode)!;
  const focusMinutes = mode === 'custom' ? customFocus : preset.focusMinutes;
  const breakMinutes = mode === 'custom' ? customBreak : preset.breakMinutes;

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setElapsed(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (mode === 'flow') {
      setTimeLeft(0);
    } else {
      setTimeLeft(focusMinutes * 60);
    }
  }, [mode, focusMinutes]);

  useEffect(() => { resetTimer(); }, [mode, customFocus, resetTimer]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (mode === 'flow') {
        setElapsed(prev => prev + 1);
        setTimeLeft(prev => prev + 1);
      } else {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer done
            if (!isBreak && breakMinutes > 0) {
              setIsBreak(true);
              toast.success('Focus session complete! Time for a break. 🎉');
              return breakMinutes * 60;
            } else {
              setIsRunning(false);
              toast.success('Session finished! Great work! 💪');
              return 0;
            }
          }
          setElapsed(e => e + 1);
          return prev - 1;
        });
      }
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isBreak, mode, breakMinutes]);

  const finishSession = () => {
    if (elapsed < 10) return;
    const xp = addSession({
      subjectId: selectedSubject || undefined,
      mode,
      duration: elapsed,
      date: new Date().toISOString(),
    });
    toast.success(`Session saved! +${xp} XP earned 🏆`);
    resetTimer();
  };

  const totalSeconds = mode === 'flow' ? 0 : focusMinutes * 60;
  const progress = mode === 'flow' ? 0 : totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Study Timer</h1>
        <p className="text-muted-foreground mt-1">Choose your focus mode and start studying.</p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {TIMER_PRESETS.map(p => (
          <button
            key={p.mode}
            onClick={() => { if (!isRunning) setMode(p.mode); }}
            className={`p-4 rounded-xl border text-left transition-all ${
              mode === p.mode
                ? 'border-primary bg-primary/10 glow-primary'
                : 'border-border bg-card hover:border-muted-foreground/30'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-2xl">{p.icon}</span>
            <p className="font-display font-semibold text-sm mt-2">{p.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
          </button>
        ))}
      </div>

      {/* Custom inputs */}
      {mode === 'custom' && !isRunning && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex gap-4 items-center">
          <label className="text-sm text-muted-foreground">
            Focus:
            <input type="number" min={1} max={180} value={customFocus} onChange={e => setCustomFocus(+e.target.value)} className="ml-2 w-16 bg-secondary border border-border rounded-md px-2 py-1 text-foreground font-mono" />
            <span className="ml-1">min</span>
          </label>
          <label className="text-sm text-muted-foreground">
            Break:
            <input type="number" min={0} max={60} value={customBreak} onChange={e => setCustomBreak(+e.target.value)} className="ml-2 w-16 bg-secondary border border-border rounded-md px-2 py-1 text-foreground font-mono" />
            <span className="ml-1">min</span>
          </label>
        </motion.div>
      )}

      {/* Subject picker */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedSubject('')}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${!selectedSubject ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
        >
          No Subject
        </button>
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(s.id)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${selectedSubject === s.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: s.color }} />
            {s.name}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="flex flex-col items-center gap-8">
        <div className="relative w-[280px] h-[280px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r="120" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
            {mode !== 'flow' && (
              <circle
                cx="130" cy="130" r="120" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={isBreak ? 'break' : 'focus'}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className={`text-xs font-medium uppercase tracking-widest mb-2 ${isBreak ? 'text-success' : 'text-primary'}`}
              >
                {isBreak ? 'Break' : mode === 'flow' ? 'Flowing' : 'Focus'}
              </motion.span>
            </AnimatePresence>
            <span className="text-5xl font-mono font-bold text-foreground">
              {formatTimerDisplay(timeLeft)}
            </span>
            {mode === 'flow' && isRunning && (
              <span className="text-xs text-muted-foreground mt-2">Elapsed: {formatTimerDisplay(elapsed)}</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={resetTimer} className="w-12 h-12 rounded-full">
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-16 h-16 rounded-full text-primary-foreground ${isRunning ? 'bg-destructive hover:bg-destructive/90' : 'gradient-primary glow-primary'}`}
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={finishSession}
            className="w-12 h-12 rounded-full"
            disabled={elapsed < 10}
          >
            <Check className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {elapsed < 10 ? 'Study for at least 10 seconds to save' : `${Math.floor(elapsed / 60)} min studied this session`}
        </p>
      </div>
    </div>
  );
}
