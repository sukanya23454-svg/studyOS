import React, { createContext, useContext } from 'react';
import { useStudyData } from '@/hooks/useStudyData';

type StudyContextType = ReturnType<typeof useStudyData>;

const StudyContext = createContext<StudyContextType | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const studyData = useStudyData();
  return <StudyContext.Provider value={studyData}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyContextType {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used within StudyProvider');
  return ctx;
}
