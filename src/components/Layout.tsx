import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MusicPlayer from './MusicPlayer';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import {
  LayoutDashboard,
  Timer,
  BookOpen,
  HelpCircle,
  FileText,
  BarChart3,
  CalendarClock,
  Sparkles,
  BrainCircuit,
  Palette,
  Users,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/timer', icon: Timer, label: 'Study Timer' },
  { to: '/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/confusion', icon: HelpCircle, label: 'Confusion Tracker' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/exams', icon: CalendarClock, label: 'Exams' },
  { to: '/ai-assistant', icon: BrainCircuit, label: 'AI Assistant' },
  { to: '/study-room', icon: Palette, label: 'Virtual Room' },
  { to: '/friends', icon: Users, label: 'Study Friends' },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { activeEnvironment } = useEnvironment();

  const bgImage = activeEnvironment?.image || '/study-bg.jpg';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-sidebar-accent-foreground">StudyOS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-sidebar-accent rounded-lg"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`relative z-10 w-4 h-4 ${isActive ? 'text-primary' : 'text-sidebar-foreground'}`} />
                <span className={`relative z-10 ${isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-sidebar border-t border-sidebar-border flex justify-around py-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-sidebar-foreground'}`} />
              <span className={`text-[10px] ${isActive ? 'text-primary' : 'text-sidebar-foreground'}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Main */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative">
        {/* Background with smooth transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        </AnimatePresence>
        <div className="fixed inset-0 bg-background/85 pointer-events-none" />
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
      <MusicPlayer />
    </div>
  );
}
