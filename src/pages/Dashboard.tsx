import { useStudy } from '@/contexts/StudyContext';
import StatCard from '@/components/StatCard';
import { formatTime, daysUntil } from '@/lib/formatters';
import { calculateLevel, xpForCurrentLevel, XP_PER_LEVEL, getLevelTitle } from '@/lib/types';
import { motion } from 'framer-motion';
import { Clock, Flame, Zap, Target, Trophy, CalendarClock, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { stats, exams, confusions, sessions } = useStudyData();
  const navigate = useNavigate();

  const dailyProgress = Math.min(100, Math.round((stats.todayStudyTime / (stats.dailyGoalMinutes * 60)) * 100));
  const level = calculateLevel(stats.totalXP);
  const levelXP = xpForCurrentLevel(stats.totalXP);
  const levelProgress = Math.round((levelXP / XP_PER_LEVEL) * 100);
  const upcomingExams = exams
    .filter(e => daysUntil(e.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  const unresolvedConfusions = confusions.filter(c => !c.resolved).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Let's make today count.</p>
        </div>
        <Button onClick={() => navigate('/timer')} className="gradient-primary text-primary-foreground gap-2 glow-primary">
          <Play className="w-4 h-4" />
          Start Studying
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Study Time" value={formatTime(stats.todayStudyTime)} icon={<Clock className="w-5 h-5 text-primary-foreground" />} accent="primary" />
        <StatCard label="Study Streak" value={`${stats.currentStreak} days`} icon={<Flame className="w-5 h-5 text-accent-foreground" />} accent="streak" subtitle={`Best: ${stats.longestStreak} days`} />
        <StatCard label="Total XP" value={stats.totalXP.toLocaleString()} icon={<Zap className="w-5 h-5 text-accent-foreground" />} accent="accent" />
        <StatCard label="Total Study Time" value={formatTime(stats.totalStudyTime)} icon={<Trophy className="w-5 h-5 text-info-foreground" />} accent="info" />
      </div>

      {/* Daily Goal & Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="gradient-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">Daily Goal</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{formatTime(stats.todayStudyTime)} / {formatTime(stats.dailyGoalMinutes * 60)}</span>
              <span className="font-mono font-semibold text-primary">{dailyProgress}%</span>
            </div>
            <Progress value={dailyProgress} className="h-3" />
            {dailyProgress >= 100 && <p className="text-sm text-success font-medium">🎉 Daily goal achieved!</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="gradient-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-xp" />
            <h2 className="text-lg font-display font-semibold">Level {level}</h2>
            <span className="text-xs text-muted-foreground ml-auto">{getLevelTitle(level)}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{levelXP} / {XP_PER_LEVEL} XP</span>
              <span className="font-mono font-semibold text-xp">{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </motion.div>
      </div>

      {/* Upcoming Exams & Confusion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="gradient-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-display font-semibold">Upcoming Exams</h2>
          </div>
          {upcomingExams.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming exams. Add one in the Exams tab.</p>
          ) : (
            <div className="space-y-3">
              {upcomingExams.map(exam => {
                const days = daysUntil(exam.date);
                return (
                  <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-sm font-medium">{exam.name}</span>
                    <span className={`text-sm font-mono font-semibold ${days <= 3 ? 'text-destructive' : days <= 7 ? 'text-warning' : 'text-muted-foreground'}`}>
                      {days === 0 ? 'Today!' : `${days}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="gradient-card rounded-xl border border-border p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">😵‍💫</span>
            <h2 className="text-lg font-display font-semibold">Topics to Review</h2>
          </div>
          {unresolvedConfusions === 0 ? (
            <p className="text-sm text-muted-foreground">No confused topics! Keep up the clarity. 🎯</p>
          ) : (
            <>
              <p className="text-3xl font-display font-bold text-warning">{unresolvedConfusions}</p>
              <p className="text-sm text-muted-foreground mt-1">unresolved topics need your attention</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/confusion')}>Review Now</Button>
            </>
          )}
        </motion.div>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="gradient-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="text-lg font-display font-semibold mb-4">Recent Sessions</h2>
          <div className="space-y-2">
            {sessions.slice(-5).reverse().map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground capitalize">{s.mode}</span>
                  <span className="font-mono">{formatTime(s.duration)}</span>
                </div>
                <span className="text-xp font-mono">+{s.xpEarned} XP</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
