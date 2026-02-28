import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Workspaces from './components/Workspaces';
import WhyChoose from './components/WhyChoose';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import AIAssistantPage from './pages/AIAssistant';
import WorkspacesPage from './pages/Workspaces';
import WorkspaceDetails from './pages/WorkspaceDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

const LandingPage = () => (
  <div className="landing-page">
    <Navbar />
    <main>
      <Hero />
      <WhyChoose />
      <Workspaces />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
    <ChatAssistant />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/workspaces" element={<WorkspacesPage />} />
            <Route path="/workspaces/:id" element={<WorkspaceDetails />} />
            <Route path="/booking/confirmation" element={<BookingConfirmation />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
