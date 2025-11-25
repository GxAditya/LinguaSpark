import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
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
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/transcription-station" element={<TranscriptionStation />} />
        <Route path="/games/audio-jumble" element={<AudioJumble />} />
        <Route path="/games/image-instinct" element={<ImageInstinct />} />
        <Route path="/games/translation-matchup" element={<TranslationMatchUp />} />
        <Route path="/games/secret-word-solver" element={<SecretWordSolver />} />
        <Route path="/games/word-drop-dash" element={<WordDropDash />} />
        <Route path="/games/conjugation-coach" element={<ConjugationCoach />} />
        <Route path="/games/context-connect" element={<ContextConnect />} />
        <Route path="/games/syntax-scrambler" element={<SyntaxScrambler />} />
        <Route path="/games/time-warp-tagger" element={<TimeWarpTagger />} />
      </Routes>
    </Router>
  );
}

export default App;