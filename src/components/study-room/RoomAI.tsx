import { useState, useRef, useEffect } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-study-assistant`;

export default function RoomAI() {
  const { addNote, addAIConversation } = useStudy();
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (responseRef.current) responseRef.current.scrollTop = responseRef.current.scrollHeight;
  }, [response]);

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text) return;
    setIsLoading(true);
    setResponse('');

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ message: text, mode: 'explain' }),
      });

      if (!resp.ok) {
        if (resp.status === 429) toast.error('Rate limited');
        else toast.error('AI error');
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error('No body');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let acc = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf('\n')) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const c = JSON.parse(json).choices?.[0]?.delta?.content;
            if (c) { acc += c; setResponse(acc); }
          } catch {}
        }
      }
      if (acc) addAIConversation('explain', text, acc);
    } catch {
      toast.error('AI request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-border/30 p-4">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between mb-1">
        <h3 className="font-display font-semibold text-sm flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-primary" /> AI Assistant
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
            <div className="pt-2 border-t border-border/30 space-y-2">
              <Textarea
                placeholder="Ask anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={2}
                className="bg-secondary/40 border-border/30 text-xs resize-none"
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleSubmit(); } }}
              />
              <Button onClick={handleSubmit} disabled={isLoading || !input.trim()} size="sm" className="w-full text-xs h-7 gradient-primary text-primary-foreground gap-1">
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                {isLoading ? 'Thinking...' : 'Ask'}
              </Button>

              {(response || isLoading) && (
                <div ref={responseRef} className="max-h-[200px] overflow-y-auto rounded-lg bg-secondary/20 p-2">
                  {isLoading && !response && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      <span className="text-[10px]">Thinking...</span>
                    </div>
                  )}
                  {response && (
                    <div className="prose prose-sm prose-invert max-w-none text-xs
                      prose-headings:text-foreground prose-headings:text-xs
                      prose-p:text-secondary-foreground prose-p:text-xs prose-p:leading-relaxed
                      prose-li:text-secondary-foreground prose-li:text-xs
                      prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:rounded
                    ">
                      <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
