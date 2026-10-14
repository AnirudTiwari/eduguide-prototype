import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import CareerGuidance from './pages/CareerGuidance';
import Feedback from './pages/Feedback';
import NotFound from './pages/NotFound';

/**
 * Root Application Component
 * Sets up client-side routing for EduGuide:
 * - "/"          -> Dashboard
 * - "/explore"   -> Explore
 * - "/career"    -> Career Guidance
 * - "/feedback"  -> Tester Feedback
 * - "*"          -> 404 Not Found
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="explore" element={<Explore />} />
          <Route path="career" element={<CareerGuidance />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
