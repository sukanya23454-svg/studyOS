import { useState } from 'react';
import { useStudyData } from '@/hooks/useStudyData';
import { daysUntil } from '@/lib/formatters';
import { motion } from 'framer-motion';
import { Plus, Trash2, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ExamsPage() {
  const { exams, subjects, addExam, deleteExam } = useStudyData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !date) { toast.error('Enter exam name and date'); return; }
    addExam(name.trim(), date, subjectId || undefined);
    setName('');
    setDate('');
    setSubjectId('');
    setShowForm(false);
    toast.success('Exam added!');
  };

  const upcoming = exams.filter(e => daysUntil(e.date) >= 0).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = exams.filter(e => daysUntil(e.date) < 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exams</h1>
          <p className="text-muted-foreground mt-1">Track your upcoming exams.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Exam
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="gradient-card rounded-xl border border-border p-5 shadow-card space-y-4">
          <Input placeholder="Exam name (e.g. Chemistry Final)" value={name} onChange={e => setName(e.target.value)} className="bg-secondary" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground" />
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground">
            <option value="">No subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Button onClick={handleAdd} className="gradient-primary text-primary-foreground">Save Exam</Button>
        </motion.div>
      )}

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CalendarClock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No exams yet. Add your first exam to start the countdown!</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-display font-semibold">Upcoming</h2>
              {upcoming.map((exam, i) => {
                const days = daysUntil(exam.date);
                const subj = subjects.find(s => s.id === exam.subjectId);
                return (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="gradient-card rounded-xl border border-border p-5 shadow-card flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-display font-semibold">{exam.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{new Date(exam.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        {subj && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: subj.color + '22', color: subj.color }}>{subj.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-right ${days <= 3 ? 'text-destructive' : days <= 7 ? 'text-warning' : 'text-primary'}`}>
                        <span className="text-2xl font-mono font-bold">{days}</span>
                        <span className="text-xs ml-1">{days === 1 ? 'day' : 'days'}</span>
                      </div>
                      <button onClick={() => { deleteExam(exam.id); toast.info('Exam deleted'); }} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {past.length > 0 && (
            <div className="space-y-3 opacity-50">
              <h2 className="text-lg font-display font-semibold">Past</h2>
              {past.map(exam => (
                <div key={exam.id} className="gradient-card rounded-xl border border-border p-4 shadow-card flex items-center justify-between">
                  <span className="text-sm line-through">{exam.name}</span>
                  <button onClick={() => deleteExam(exam.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
