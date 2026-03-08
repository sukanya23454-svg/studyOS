import { useState, useEffect, useCallback } from 'react';
import type { Subject, StudySession, Exam, ConfusionItem, Note, AIConversation, UserStats } from '@/lib/types';
import { XP_PER_MINUTE, calculateLevel } from '@/lib/types';

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

const today = () => new Date().toISOString().split('T')[0];

const defaultStats: UserStats = {
  totalStudyTime: 0,
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: '',
  dailyGoalMinutes: 120,
  todayStudyTime: 0,
  todayDate: today(),
};

export function useStudyData() {
  const [subjects, setSubjects] = useState<Subject[]>(() => loadJSON('studyos_subjects', []));
  const [sessions, setSessions] = useState<StudySession[]>(() => loadJSON('studyos_sessions', []));
  const [exams, setExams] = useState<Exam[]>(() => loadJSON('studyos_exams', []));
  const [confusions, setConfusions] = useState<ConfusionItem[]>(() => loadJSON('studyos_confusions', []));
  const [notes, setNotes] = useState<Note[]>(() => loadJSON('studyos_notes', []));
  const [aiHistory, setAiHistory] = useState<AIConversation[]>(() => loadJSON('studyos_ai_history', []));
  const [stats, setStats] = useState<UserStats>(() => {
    const s = loadJSON('studyos_stats', defaultStats);
    if (s.todayDate !== today()) {
      return { ...s, todayStudyTime: 0, todayDate: today() };
    }
    return s;
  });

  useEffect(() => saveJSON('studyos_subjects', subjects), [subjects]);
  useEffect(() => saveJSON('studyos_sessions', sessions), [sessions]);
  useEffect(() => saveJSON('studyos_exams', exams), [exams]);
  useEffect(() => saveJSON('studyos_confusions', confusions), [confusions]);
  useEffect(() => saveJSON('studyos_notes', notes), [notes]);
  useEffect(() => saveJSON('studyos_stats', stats), [stats]);

  const addSubject = useCallback((name: string, color: string) => {
    setSubjects(prev => [...prev, { id: crypto.randomUUID(), name, color, totalStudyTime: 0, createdAt: new Date().toISOString() }]);
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  const addSession = useCallback((session: Omit<StudySession, 'id' | 'xpEarned'>) => {
    const xpEarned = Math.floor((session.duration / 60) * XP_PER_MINUTE);
    const newSession: StudySession = { ...session, id: crypto.randomUUID(), xpEarned };
    setSessions(prev => [...prev, newSession]);

    // Update subject study time
    if (session.subjectId) {
      setSubjects(prev => prev.map(s => s.id === session.subjectId ? { ...s, totalStudyTime: s.totalStudyTime + session.duration } : s));
    }

    // Update stats
    setStats(prev => {
      const todayDate = today();
      const isNewDay = prev.todayDate !== todayDate;
      const isConsecutive = prev.lastStudyDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = prev.lastStudyDate === todayDate ? prev.currentStreak : (isConsecutive ? prev.currentStreak + 1 : 1);

      return {
        ...prev,
        totalStudyTime: prev.totalStudyTime + session.duration,
        totalXP: prev.totalXP + xpEarned,
        level: calculateLevel(prev.totalXP + xpEarned),
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastStudyDate: todayDate,
        todayStudyTime: (isNewDay ? 0 : prev.todayStudyTime) + session.duration,
        todayDate,
      };
    });

    return xpEarned;
  }, []);

  const addExam = useCallback((name: string, date: string, subjectId?: string) => {
    setExams(prev => [...prev, { id: crypto.randomUUID(), name, date, subjectId, createdAt: new Date().toISOString() }]);
  }, []);

  const deleteExam = useCallback((id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  }, []);

  const addConfusion = useCallback((topic: string, subjectId?: string) => {
    setConfusions(prev => [...prev, { id: crypto.randomUUID(), topic, subjectId, resolved: false, createdAt: new Date().toISOString() }]);
  }, []);

  const toggleConfusion = useCallback((id: string) => {
    setConfusions(prev => prev.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));
  }, []);

  const deleteConfusion = useCallback((id: string) => {
    setConfusions(prev => prev.filter(c => c.id !== id));
  }, []);

  const addNote = useCallback((title: string, content: string, subjectId?: string) => {
    setNotes(prev => [...prev, { id: crypto.randomUUID(), title, content, subjectId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
  }, []);

  const updateNote = useCallback((id: string, title: string, content: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const setDailyGoal = useCallback((minutes: number) => {
    setStats(prev => ({ ...prev, dailyGoalMinutes: minutes }));
  }, []);

  return {
    subjects, sessions, exams, confusions, notes, stats,
    addSubject, deleteSubject, addSession,
    addExam, deleteExam,
    addConfusion, toggleConfusion, deleteConfusion,
    addNote, updateNote, deleteNote,
    setDailyGoal,
  };
}
