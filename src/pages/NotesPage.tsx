import { useState } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { motion } from 'framer-motion';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function NotesPage() {
  const { notes, subjects, addNote, updateNote, deleteNote } = useStudyData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const handleSave = () => {
    if (!title.trim()) { toast.error('Enter a title'); return; }
    if (editId) {
      updateNote(editId, title.trim(), content);
      toast.success('Note updated!');
    } else {
      addNote(title.trim(), content, subjectId || undefined);
      toast.success('Note added!');
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setTitle('');
    setContent('');
    setSubjectId('');
  };

  const startEdit = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    setEditId(id);
    setTitle(note.title);
    setContent(note.content);
    setSubjectId(note.subjectId || '');
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground mt-1">Quick notes organized by subject.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> New Note
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="gradient-card rounded-xl border border-border p-5 shadow-card space-y-4">
          <Input placeholder="Note title" value={title} onChange={e => setTitle(e.target.value)} className="bg-secondary" />
          <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground">
            <option value="">No subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Textarea placeholder="Write your notes here..." value={content} onChange={e => setContent(e.target.value)} rows={8} className="bg-secondary font-mono text-sm" />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gradient-primary text-primary-foreground">{editId ? 'Update' : 'Save'}</Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </motion.div>
      )}

      {notes.length === 0 && !showForm ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No notes yet. Start capturing your thoughts!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((n, i) => {
            const subj = subjects.find(s => s.id === n.subjectId);
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => startEdit(n.id)}
                className="gradient-card rounded-xl border border-border p-5 shadow-card cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-display font-semibold text-sm">{n.title}</h3>
                  <button onClick={e => { e.stopPropagation(); deleteNote(n.id); toast.info('Note deleted'); }} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {subj && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: subj.color }} />
                    <span className="text-xs text-muted-foreground">{subj.name}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{n.content || 'Empty note'}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
