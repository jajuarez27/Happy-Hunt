import { Routes, Route } from 'react-router-dom';
import DealsPage from './pages/DealsPage.jsx';
import DealDetailPage from './pages/DealDetailPage.jsx';
import PlacePage from './pages/PlacePage.jsx';
import BottomNav from './components/BottomNav.jsx';

export default function App() {
  return (
    <div className="app">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DealsPage />} />
          <Route path="/deals/:id" element={<DealDetailPage />} />
          <Route path="/places/:id" element={<PlacePage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
