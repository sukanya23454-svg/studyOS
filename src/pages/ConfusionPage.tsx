import { useState } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { motion } from 'framer-motion';
import { Plus, Check, Trash2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ConfusionPage() {
  const { confusions, subjects, addConfusion, toggleConfusion, deleteConfusion } = useStudy();
  const [topic, setTopic] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const handleAdd = () => {
    if (!topic.trim()) { toast.error('Enter a topic'); return; }
    addConfusion(topic.trim(), subjectId || undefined);
    setTopic('');
    toast.success('Topic added to review list');
  };

  const unresolved = confusions.filter(c => !c.resolved);
  const resolved = confusions.filter(c => c.resolved);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Confusion Tracker</h1>
        <p className="text-muted-foreground mt-1">Track topics you didn't understand for later review.</p>
      </div>

      {/* Add form */}
      <div className="flex gap-2">
        <Input
          placeholder="e.g. redox half reactions, benzene resonance..."
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="bg-secondary flex-1"
        />
        <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground w-36">
          <option value="">No subject</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <Button onClick={handleAdd} className="gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Unresolved */}
      <div>
        <h2 className="text-lg font-display font-semibold mb-3 flex items-center gap-2">
          <span className="text-warning">😵‍💫</span> Needs Review ({unresolved.length})
        </h2>
        {unresolved.length === 0 ? (
          <p className="text-sm text-muted-foreground">All clear! No confused topics. 🎉</p>
        ) : (
          <div className="space-y-2">
            {unresolved.map((c, i) => {
              const subj = subjects.find(s => s.id === c.subjectId);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                >
                  <button onClick={() => { toggleConfusion(c.id); toast.success('Marked as understood! 🧠'); }} className="text-muted-foreground hover:text-success transition-colors">
                    <div className="w-5 h-5 rounded-full border-2 border-current" />
                  </button>
                  <span className="flex-1 text-sm">{c.topic}</span>
                  {subj && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: subj.color + '22', color: subj.color }}>{subj.name}</span>}
                  <button onClick={() => { deleteConfusion(c.id); }} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold mb-3 flex items-center gap-2">
            <Check className="w-5 h-5 text-success" /> Understood ({resolved.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {resolved.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <button onClick={() => toggleConfusion(c.id)} className="text-success">
                  <Check className="w-5 h-5" />
                </button>
                <span className="flex-1 text-sm line-through">{c.topic}</span>
                <button onClick={() => deleteConfusion(c.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
