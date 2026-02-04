import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Volume2, Check, X, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import { useGameSession } from '../hooks/useGameSession';
import { GameLoading, GameError } from '../components/GameStates';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { getLearningLanguageMeta } from '../utils/languages';

interface TranscriptionRound {
  audioText: string;
  correctAnswer: string;
  hint?: string;
}

interface TranscriptionStationContent {
  rounds: TranscriptionRound[];
}

export default function TranscriptionStation() {
  const {
    content,
    currentRound,
    totalRounds,
    score,
    loading,
    error,
    isComplete,
    showExitConfirm,
    setShowExitConfirm,
    submitAnswer,
    updateScore,
    nextRound,
    completeGame,
    confirmExit,
    cancelExit,
    startNewGame,
    targetLanguage,
  } = useGameSession('transcription-station');

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const rounds: TranscriptionRound[] = useMemo(() => {
    const rawRounds = (content as TranscriptionStationContent | null)?.rounds;
    return Array.isArray(rawRounds) ? rawRounds : [];
  }, [content]);

  const currentClip = rounds[currentRound];
  const languageMeta = getLearningLanguageMeta(targetLanguage);

  useEffect(() => {
    setUserInput('');
    setFeedback(null);
  }, [currentRound, content]);

  if (loading) return <GameLoading gameName="Transcription Station" />;
  if (error) return <GameError error={error} onRetry={startNewGame} />;

  const handlePlayAudio = () => {
    if (!currentClip) return;
    const utterance = new SpeechSynthesisUtterance(currentClip.audioText);
    utterance.lang = languageMeta.bcp47;
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async () => {
    if (!currentClip || feedback !== null) return;

    const expected = currentClip.correctAnswer.trim();
    const received = userInput.trim();

    const isCorrect = received.toLocaleLowerCase() === expected.toLocaleLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    const points = isCorrect ? 10 : 0;
    if (isCorrect) {
      updateScore(score + points);
    }

    await submitAnswer({
      roundIndex: currentRound,
      userInput,
      correct: isCorrect,
      points
    });
  };

  const handleNext = async () => {
    setUserInput('');
    setFeedback(null);
    if (currentRound + 1 >= totalRounds) {
      await completeGame();
      return;
    }
    nextRound();
  };

  if (isComplete) {
    return (
      <GameLayout title="Transcription Station">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-3xl font-bold text-content-primary mb-2">Game Complete!</h2>
          <p className="text-xl text-content-secondary mb-6">
            Final Score: <span className="font-bold text-accent">{score}</span>
          </p>
          <div className="flex gap-4">
            <Link to="/games" className="btn-secondary px-6 py-3">
              Back to Games
            </Link>
            <button onClick={startNewGame} className="btn-primary px-6 py-3 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (!currentClip) return <GameLoading gameName="Transcription Station" />;

  return (
    <GameLayout title="Transcription Station" score={score} progress={`${currentRound + 1}/${totalRounds}`}>
      <ExitConfirmModal
        isOpen={showExitConfirm}
        onConfirm={confirmExit}
        onCancel={cancelExit}
      />
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 mb-8">
          <p className="text-sm text-gray-600 mb-4">Listen to the audio clip and type exactly what you hear.</p>
          <div className="text-sm text-gray-500 mb-4">Hint: {currentClip.hint}</div>

          <button
            onClick={handlePlayAudio}
            className="btn-primary w-full px-6 py-4 flex items-center justify-center gap-3 mb-6"
          >
            <Volume2 className="w-5 h-5" />
            Play Audio
          </button>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer:</label>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !feedback && handleSubmit()}
              placeholder="Type what you hear..."
              className="input-primary"
              disabled={feedback !== null}
              lang={languageMeta.bcp47}
              dir={languageMeta.dir}
            />
          </div>

          {feedback && (
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${feedback === 'correct'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
              }`}>
              {feedback === 'correct' ? (
                <>
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Correct!</p>
                    <p className="text-sm text-green-800">You earned 10 points!</p>
                  </div>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">Not quite right</p>
                    <p className="text-sm text-red-800">Correct answer: {currentClip.correctAnswer}</p>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {!feedback ? (
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="btn-primary px-6 py-3 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary px-6 py-3 flex-1 flex items-center justify-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="btn-ghost px-4 py-2 text-sm"
          >
            Exit Game
          </button>
        </div>
      </div>
    </GameLayout>
  );
}
