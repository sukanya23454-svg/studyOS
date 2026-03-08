import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  text: string;
  done: boolean;
}

export default function RoomTasks() {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('study-room-tasks') || '[]');
    } catch { return []; }
  });
  const [newTask, setNewTask] = useState('');

  const save = (t: Task[]) => {
    setTasks(t);
    localStorage.setItem('study-room-tasks', JSON.stringify(t));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    save([...tasks, { id: crypto.randomUUID(), text: newTask.trim(), done: false }]);
    setNewTask('');
  };

  const toggleTask = (id: string) => save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id: string) => save(tasks.filter(t => t.id !== id));

  const doneCount = tasks.filter(t => t.done).length;

  return (
    <div className="glass-panel rounded-2xl border border-border/30 p-4">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between mb-1">
        <h3 className="font-display font-semibold text-sm flex items-center gap-2">
          ✅ Tasks
          {tasks.length > 0 && (
            <span className="text-[10px] text-muted-foreground font-normal">{doneCount}/{tasks.length}</span>
          )}
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
              <div className="flex gap-1.5">
                <Input
                  placeholder="Add a study goal..."
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                  className="bg-secondary/40 border-border/30 text-xs h-8 flex-1"
                />
                <Button onClick={addTask} size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/20 group">
                    <button
                      onClick={() => toggleTask(t.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        t.done ? 'bg-primary/20 border-primary/40 text-primary' : 'border-border/50'
                      }`}
                    >
                      {t.done && <Check className="w-2.5 h-2.5" />}
                    </button>
                    <span className={`text-xs flex-1 ${t.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {t.text}
                    </span>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-[10px] text-muted-foreground text-center py-2">No tasks yet</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
