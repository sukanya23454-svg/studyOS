import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MusicPlayer from './MusicPlayer';
import AnimatedBackground from './AnimatedBackground';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  LogOut,
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
  { to: '/study-room', icon: Palette, label: 'Study Room' },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { activeEnvironment } = useEnvironment();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Animated Environment Background */}
      <AnimatePresence mode="wait">
        {activeEnvironment ? (
          <motion.div
            key={activeEnvironment.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-0"
          >
            {/* Base: image or gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: activeEnvironment.image
                  ? `url(${activeEnvironment.image})`
                  : undefined,
                background: !activeEnvironment.image
                  ? activeEnvironment.gradient
                  : undefined,
              }}
            />
            {/* Gradient overlay on images */}
            {activeEnvironment.image && (
              <div
                className="absolute inset-0"
                style={{ background: activeEnvironment.gradient, opacity: 0.4 }}
              />
            )}
            {/* Animated particles */}
            <AnimatedBackground sceneId={activeEnvironment.id} />
          </motion.div>
        ) : (
          <motion.div
            key="default-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(/study-bg.jpg)` }}
          />
        )}
      </AnimatePresence>

      {/* Dim overlay for readability — very light when environment is active */}
      <div className={`fixed inset-0 z-[1] pointer-events-none ${activeEnvironment ? 'bg-background/35' : 'bg-background/75'}`} />

      {/* Sidebar - glass style */}
      <aside className="hidden md:flex w-64 flex-col relative z-10 glass-panel border-r border-border/30">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border/30">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">StudyOS</span>
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
                    className="absolute inset-0 bg-primary/10 backdrop-blur-sm rounded-lg border border-primary/20"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`relative z-10 w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`relative z-10 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-panel border-t border-border/30 flex justify-around py-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-0.5 px-2 py-1"
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Main */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative z-10">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative p-4 md:p-8 max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
      <MusicPlayer />
    </div>
  );
}
