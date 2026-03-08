import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: 'primary' | 'accent' | 'streak' | 'info';
  subtitle?: string;
}

const accentClasses = {
  primary: 'gradient-primary',
  accent: 'gradient-accent',
  streak: 'gradient-streak',
  info: 'bg-info',
};

export default function StatCard({ label, value, icon, accent = 'primary', subtitle }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-card rounded-xl border border-border p-5 shadow-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-display font-bold text-foreground animate-count-up">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg ${accentClasses[accent]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
