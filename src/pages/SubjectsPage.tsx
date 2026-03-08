import { useState } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { SUBJECT_COLORS } from '@/lib/types';
import { formatTime } from '@/lib/formatters';
import { motion } from 'framer-motion';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function SubjectsPage() {
  const { subjects, addSubject, deleteSubject } = useStudyData();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(SUBJECT_COLORS[0]);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) { toast.error('Enter a subject name'); return; }
    addSubject(name.trim(), selectedColor);
    setName('');
    setShowForm(false);
    toast.success('Subject added!');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground mt-1">Organize your study by subject.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Subject
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="gradient-card rounded-xl border border-border p-5 shadow-card space-y-4">
          <Input placeholder="Subject name (e.g. Chemistry)" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="bg-secondary" />
          <div className="flex gap-2">
            {SUBJECT_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-8 h-8 rounded-full transition-transform ${selectedColor === c ? 'scale-125 ring-2 ring-foreground' : ''}`}
                style={{ background: c }}
              />
            ))}
          </div>
          <Button onClick={handleAdd} className="gradient-primary text-primary-foreground">Save Subject</Button>
        </motion.div>
      )}

      {subjects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No subjects yet. Add your first subject to start tracking!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="gradient-card rounded-xl border border-border p-5 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: s.color }} />
                  <h3 className="font-display font-semibold">{s.name}</h3>
                </div>
                <button onClick={() => { deleteSubject(s.id); toast.info('Subject deleted'); }} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">Study time: <span className="font-mono text-foreground">{formatTime(s.totalStudyTime)}</span></p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
