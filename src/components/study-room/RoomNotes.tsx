import { useState } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function RoomNotes() {
  const { notes, addNote, updateNote, deleteNote } = useStudy();
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    if (editId) {
      updateNote(editId, title.trim(), content);
      toast.success('Note updated');
    } else {
      addNote(title.trim(), content);
      toast.success('Note added');
    }
    setShowForm(false);
    setEditId(null);
    setTitle('');
    setContent('');
  };

  const startEdit = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    setEditId(id);
    setTitle(note.title);
    setContent(note.content);
    setShowForm(true);
    setExpanded(true);
  };

  return (
    <div className="glass-panel rounded-2xl border border-border/30 p-4">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between mb-1">
        <h3 className="font-display font-semibold text-sm flex items-center gap-2">
          📝 Notes
          <span className="text-[10px] text-muted-foreground font-normal">{notes.length}</span>
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
              {showForm ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Note title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="bg-secondary/40 border-border/30 text-xs h-8"
                  />
                  <Textarea
                    placeholder="Write here..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={3}
                    className="bg-secondary/40 border-border/30 text-xs resize-none"
                  />
                  <div className="flex gap-1.5">
                    <Button onClick={handleSave} size="sm" className="text-xs h-7 gradient-primary text-primary-foreground">
                      {editId ? 'Update' : 'Save'}
                    </Button>
                    <Button onClick={() => { setShowForm(false); setEditId(null); setTitle(''); setContent(''); }} size="sm" variant="ghost" className="text-xs h-7">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => { setShowForm(true); setEditId(null); setTitle(''); setContent(''); }}
                  size="sm"
                  variant="ghost"
                  className="w-full text-xs h-7 gap-1"
                >
                  <Plus className="w-3 h-3" /> Quick Note
                </Button>
              )}

              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {notes.slice(0, 10).map(n => (
                  <div
                    key={n.id}
                    onClick={() => startEdit(n.id)}
                    className="flex items-start justify-between p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{n.title}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{n.content || 'Empty'}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteNote(n.id); toast.info('Deleted'); }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
