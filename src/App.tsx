import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SocialProof from './components/SocialProof';
import CTA from './components/CTA';
import Footer from './components/Footer';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import Lessons from './pages/Lessons';
import Practice from './pages/Practice';
import TranscriptionStation from './games/TranscriptionStation';
import AudioJumble from './games/AudioJumble';
import ImageInstinct from './games/ImageInstinct';
import TranslationMatchUp from './games/TranslationMatchUp';
import SecretWordSolver from './games/SecretWordSolver';
import WordDropDash from './games/WordDropDash';
import ConjugationCoach from './games/ConjugationCoach';
import ContextConnect from './games/ContextConnect';
import SyntaxScrambler from './games/SyntaxScrambler';
import TimeWarpTagger from './games/TimeWarpTagger';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

// Public route that redirects to dashboard if authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen">
            <Header />
            <Hero />
            <Features />
            <SocialProof />
            <CTA />
            <Footer />
          </div>
        }
      />
      <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
      <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
      <Route path="/games/transcription-station" element={<ProtectedRoute><TranscriptionStation /></ProtectedRoute>} />
      <Route path="/games/audio-jumble" element={<ProtectedRoute><AudioJumble /></ProtectedRoute>} />
      <Route path="/games/image-instinct" element={<ProtectedRoute><ImageInstinct /></ProtectedRoute>} />
      <Route path="/games/translation-matchup" element={<ProtectedRoute><TranslationMatchUp /></ProtectedRoute>} />
      <Route path="/games/secret-word-solver" element={<ProtectedRoute><SecretWordSolver /></ProtectedRoute>} />
      <Route path="/games/word-drop-dash" element={<ProtectedRoute><WordDropDash /></ProtectedRoute>} />
      <Route path="/games/conjugation-coach" element={<ProtectedRoute><ConjugationCoach /></ProtectedRoute>} />
      <Route path="/games/context-connect" element={<ProtectedRoute><ContextConnect /></ProtectedRoute>} />
      <Route path="/games/syntax-scrambler" element={<ProtectedRoute><SyntaxScrambler /></ProtectedRoute>} />
      <Route path="/games/time-warp-tagger" element={<ProtectedRoute><TimeWarpTagger /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;