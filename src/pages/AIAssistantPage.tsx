import { useState, useRef, useEffect } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, FileText, HelpCircle, Send, Loader2, Sparkles, RotateCcw,
  Save, CalendarClock, History, Trash2, Clock, ChevronRight, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import type { AIConversation } from '@/lib/types';

type Mode = 'explain' | 'summarize' | 'questions';

const MODES = [
  {
    id: 'explain' as Mode,
    label: 'Concept Explainer',
    icon: Brain,
    placeholder: 'e.g. "Explain oxidation and reduction simply"',
    description: 'Get simple explanations with examples',
    color: 'hsl(var(--primary))',
  },
  {
    id: 'summarize' as Mode,
    label: 'Note Summarizer',
    icon: FileText,
    placeholder: 'Paste your study notes here...',
    description: 'Convert notes into flashcards & summaries',
    color: 'hsl(var(--accent))',
  },
  {
    id: 'questions' as Mode,
    label: 'Question Generator',
    icon: HelpCircle,
    placeholder: 'e.g. "Electrochemistry" or "World War II causes"',
    description: 'Generate practice questions for any topic',
    color: 'hsl(var(--info))',
  },
];

const MODE_LABELS: Record<Mode, string> = {
  explain: 'Explanation',
  summarize: 'Summary',
  questions: 'Practice Questions',
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-study-assistant`;

export default function AIAssistantPage() {
  const {
    addNote, addExam, addAIConversation, deleteAIConversation,
    clearAIHistory, aiHistory,
  } = useStudy();

  const [mode, setMode] = useState<Mode>('explain');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text) { toast.error('Please enter something first'); return; }

    setIsLoading(true);
    setResponse('');

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ message: text, mode }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'Request failed' }));
        if (resp.status === 429) toast.error('Rate limit reached. Please wait and try again.');
        else if (resp.status === 402) toast.error('AI credits exhausted. Add credits in Settings → Workspace → Usage.');
        else toast.error(err.error || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let accumulated = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) { accumulated += content; setResponse(accumulated); }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) { accumulated += content; setResponse(accumulated); }
          } catch { /* ignore */ }
        }
      }

      // Auto-save to history
      if (accumulated) {
        addAIConversation(mode, text, accumulated);
      }
    } catch (e) {
      console.error('AI error:', e);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToNotes = () => {
    if (!response) return;
    const title = `AI ${MODE_LABELS[mode]}: ${input.slice(0, 60)}${input.length > 60 ? '…' : ''}`;
    addNote(title, response);
    toast.success('Saved to Notes!');
  };

  const handleSaveToExam = () => {
    if (!response) return;
    const examName = `Practice: ${input.slice(0, 50)}${input.length > 50 ? '…' : ''}`;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    addExam(examName, futureDate.toISOString().split('T')[0]);
    // Also save the questions as a note for reference
    addNote(`📝 ${examName}`, response);
    toast.success('Practice exam created & questions saved to Notes!');
  };

  const loadConversation = (conv: AIConversation) => {
    setMode(conv.mode);
    setInput(conv.query);
    setResponse(conv.response);
    setShowHistory(false);
  };

  const currentMode = MODES.find(m => m.id === mode)!;
  const sortedHistory = [...aiHistory].reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display">AI Study Assistant</h1>
            <p className="text-muted-foreground text-sm">Your smart companion for learning faster</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          className="gap-1.5"
        >
          <History className="w-4 h-4" />
          History
          {aiHistory.length > 0 && (
            <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-mono">
              {aiHistory.length}
            </span>
          )}
        </Button>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="gradient-card rounded-xl border border-border p-4 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-sm">Conversation History</h3>
                <div className="flex gap-2">
                  {aiHistory.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => { clearAIHistory(); toast.info('History cleared'); }} className="text-xs text-muted-foreground h-7">
                      Clear all
                    </Button>
                  )}
                  <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {sortedHistory.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No conversations yet. Start asking!</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {sortedHistory.map((conv) => {
                    const modeInfo = MODES.find(m => m.id === conv.mode);
                    const ModeIcon = modeInfo?.icon || Brain;
                    return (
                      <motion.button
                        key={conv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => loadConversation(conv)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border/50 transition-all text-left group"
                      >
                        <ModeIcon className="w-4 h-4 shrink-0" style={{ color: modeInfo?.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{conv.query}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{MODE_LABELS[conv.mode]}</span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(conv.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteAIConversation(conv.id); toast.info('Removed'); }}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MODES.map((m) => {
          const isActive = mode === m.id;
          return (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setMode(m.id); setResponse(''); }}
              className={`relative rounded-xl border p-4 text-left transition-all ${
                isActive
                  ? 'border-primary/60 glow-primary gradient-card'
                  : 'border-border gradient-card hover:border-muted-foreground/30'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
                <span className="font-display font-semibold text-sm text-foreground">{m.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{m.description}</p>
              {isActive && (
                <motion.div
                  layoutId="mode-indicator"
                  className="absolute -bottom-px left-4 right-4 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Input */}
      <div className="gradient-card rounded-xl border border-border p-5 shadow-card space-y-4">
        <Textarea
          placeholder={currentMode.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={mode === 'summarize' ? 8 : 3}
          className="bg-secondary border-border font-mono text-sm resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-[10px] font-mono">⌘ Enter</kbd> to send
          </span>
          <div className="flex gap-2">
            {response && (
              <Button variant="outline" size="sm" onClick={() => { setResponse(''); setInput(''); }} className="gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="gradient-primary text-primary-foreground gap-2"
              size="sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isLoading ? 'Thinking...' : 'Ask AI'}
            </Button>
          </div>
        </div>
      </div>

      {/* Response */}
      <AnimatePresence>
        {(response || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="gradient-card rounded-xl border border-border shadow-card overflow-hidden"
          >
            {/* Save Actions Bar */}
            {response && !isLoading && (
              <div className="flex items-center gap-2 px-6 pt-4 pb-0">
                <Button variant="outline" size="sm" onClick={handleSaveToNotes} className="gap-1.5 text-xs">
                  <Save className="w-3.5 h-3.5" /> Save to Notes
                </Button>
                {mode === 'questions' && (
                  <Button variant="outline" size="sm" onClick={handleSaveToExam} className="gap-1.5 text-xs">
                    <CalendarClock className="w-3.5 h-3.5" /> Create Practice Exam
                  </Button>
                )}
              </div>
            )}

            <div ref={responseRef} className="p-6 max-h-[60vh] overflow-y-auto">
              {isLoading && !response && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              )}
              {response && (
                <div className="prose prose-sm prose-invert max-w-none
                  prose-headings:font-display prose-headings:text-foreground
                  prose-h2:text-lg prose-h2:mt-4 prose-h2:mb-2
                  prose-p:text-secondary-foreground prose-p:leading-relaxed
                  prose-li:text-secondary-foreground
                  prose-strong:text-foreground
                  prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                ">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
