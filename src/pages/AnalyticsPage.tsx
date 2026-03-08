import { useStudy } from '@/contexts/StudyContext';
import { formatTime } from '@/lib/formatters';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const { sessions, subjects, stats } = useStudy();

  // Study time by subject
  const subjectData = subjects.map(s => ({
    name: s.name,
    minutes: Math.round(s.totalStudyTime / 60),
    color: s.color,
  })).filter(d => d.minutes > 0);

  // Weekly data (last 7 days)
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayMinutes = sessions
      .filter(s => s.date.startsWith(dateStr))
      .reduce((sum, s) => sum + s.duration, 0) / 60;
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      minutes: Math.round(dayMinutes),
    };
  });

  // Sessions by mode
  const modeCount: Record<string, number> = {};
  sessions.forEach(s => { modeCount[s.mode] = (modeCount[s.mode] || 0) + 1; });
  const modeData = Object.entries(modeCount).map(([name, value]) => ({ name, value }));
  const modeColors = ['hsl(170,80%,45%)', 'hsl(200,80%,55%)', 'hsl(38,90%,55%)', 'hsl(260,70%,60%)', 'hsl(15,85%,55%)'];

  const totalSessions = sessions.length;
  const avgSessionMin = totalSessions > 0 ? Math.round(sessions.reduce((s, x) => s + x.duration, 0) / totalSessions / 60) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Understand your study habits.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: totalSessions },
          { label: 'Avg Session', value: `${avgSessionMin}m` },
          { label: 'Total Hours', value: `${Math.round(stats.totalStudyTime / 3600)}h` },
          { label: 'Total XP', value: stats.totalXP.toLocaleString() },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="gradient-card rounded-xl border border-border p-4 shadow-card text-center">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-display font-bold mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="gradient-card rounded-xl border border-border p-6 shadow-card">
        <h2 className="text-lg font-display font-semibold mb-4">This Week</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data yet. Start studying to see your progress!</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,16%)" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(215,15%,50%)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(215,15%,50%)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'hsl(220,20%,10%)', border: '1px solid hsl(220,15%,16%)', borderRadius: 8, color: 'hsl(210,20%,92%)' }} />
              <Bar dataKey="minutes" fill="hsl(170,80%,45%)" radius={[4, 4, 0, 0]} name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Subject & Mode breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="gradient-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="text-lg font-display font-semibold mb-4">By Subject</h2>
          {subjectData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No subject data yet.</p>
          ) : (
            <div className="space-y-3">
              {subjectData.sort((a, b) => b.minutes - a.minutes).map(d => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-sm flex-1">{d.name}</span>
                  <span className="text-sm font-mono text-muted-foreground">{d.minutes}m</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="gradient-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="text-lg font-display font-semibold mb-4">By Mode</h2>
          {modeData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No session data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={modeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name} (${value})`}>
                  {modeData.map((_, i) => <Cell key={i} fill={modeColors[i % modeColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(220,20%,10%)', border: '1px solid hsl(220,15%,16%)', borderRadius: 8, color: 'hsl(210,20%,92%)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </div>
  );
}
