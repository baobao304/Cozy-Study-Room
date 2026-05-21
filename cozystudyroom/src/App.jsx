import "./App.css";
import { AmbienceCard } from "./components/AmbienceCard.jsx";
import { ProgressStatsCard } from "./components/ProgressStatsCard.jsx";
import { StudyFooter } from "./components/StudyFooter.jsx";
import { StudyHeader } from "./components/StudyHeader.jsx";
import { FocusQuoteCard } from "./components/FocusQuoteCard.jsx";
import { StudyTimerCard } from "./components/StudyTimerCard.jsx";
import { TodayTasksCard } from "./components/TodayTasksCard.jsx";
import { Sidebar } from "./components/Sidebar.jsx";

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar-area">
        <Sidebar />
      </aside>

      <header className="header-area">
        <StudyHeader />
      </header>

      <main className="main-area" aria-label="Main workspace">
        <div className="study-dashboard" aria-label="Study dashboard">
          <StudyTimerCard className="featured-card" />
          <TodayTasksCard />
          <FocusQuoteCard />
          <ProgressStatsCard />
          <AmbienceCard />
        </div>
      </main>

      <footer className="bottom-area">
        <StudyFooter />
      </footer>
    </div>
  );
}

export default App;
