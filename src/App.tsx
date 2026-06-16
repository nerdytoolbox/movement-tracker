import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { BottomNav } from './components/ui/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { SnacksScreen } from './screens/SnacksScreen';
import { RoutinesScreen } from './screens/RoutinesScreen';
import { SkillTreeScreen } from './screens/SkillTreeScreen';
import { StatsScreen } from './screens/StatsScreen';
import { RemindersScreen } from './screens/RemindersScreen';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/snacks" element={<SnacksScreen />} />
            <Route path="/routines" element={<RoutinesScreen />} />
            <Route path="/skills" element={<SkillTreeScreen />} />
            <Route path="/stats" element={<StatsScreen />} />
            <Route path="/reminders" element={<RemindersScreen />} />
          </Routes>
          <BottomNav />
        </div>
      </Router>
    </AppProvider>
  );
}
