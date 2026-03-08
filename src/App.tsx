import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudyProvider } from "@/contexts/StudyContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import TimerPage from "@/pages/TimerPage";
import SubjectsPage from "@/pages/SubjectsPage";
import NotesPage from "@/pages/NotesPage";
import ConfusionPage from "@/pages/ConfusionPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ExamsPage from "@/pages/ExamsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StudyProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/timer" element={<TimerPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/confusion" element={<ConfusionPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </StudyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
