import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { TodayTasks } from "@/pages/TodayTasks";
import { SpecialDates } from "@/pages/SpecialDates";
import { Notes } from "@/pages/Notes";
import { Settings } from "@/pages/Settings";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useTaskStore } from "@/store/taskStore";
import { useNoteStore } from "@/store/noteStore";
import { Toaster } from "sonner";

export default function App() {
  const { loadTasks } = useTaskStore();
  const { loadNotes } = useNoteStore();

  // 应用启动时加载数据
  useEffect(() => {
    console.log('App组件启动，开始加载数据...');
    loadTasks();
    loadNotes();
  }, [loadTasks, loadNotes]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/today" element={<TodayTasks />} />
          <Route path="/special-dates" element={<SpecialDates />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <Toaster 
          position="top-center"
          richColors
          closeButton
          theme="system"
        />
      </Router>
    </ThemeProvider>
  );
}
