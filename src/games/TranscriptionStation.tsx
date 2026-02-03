import React, { useState } from 'react';
import { ChevronRight, Volume2, Check, X } from 'lucide-react';
import GameLayout from '../components/GameLayout';
import { useGameSession } from '../hooks/useGameSession';
import { GameLoading, GameError } from '../components/GameStates';
import ExitConfirmModal from '../components/ExitConfirmModal';

interface AudioClip {
  id: number;
  text: string;
  hint: string;
}

interface TranscriptionStationContent {
  audioClips: AudioClip[];
}

export default function TranscriptionStation() {
  const {
    session,
    loading,
    error,
    showExitConfirm,
    submitAnswer,
    completeGame,
    confirmExit,
    cancelExit,
    startNewGame
  } = useGameSession('transcription-station');

  const [currentRound, setCurrentRound] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const content = session?.content as TranscriptionStationContent | undefined;
  const audioClips = content?.audioClips || [];
  const currentClip = audioClips[currentRound];
  const isComplete = currentRound >= audioClips.length;

  if (loading) return <GameLoading gameName="Transcription Station" />;
  if (error) return <GameError error={error} onRetry={startNewGame} />;
  if (!session || !content) return <GameLoading gameName="Transcription Station" />;

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(currentClip.text);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async () => {
    const isCorrect = userInput.toLowerCase().trim() === currentClip.text.toLowerCase().trim();
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    const points = isCorrect ? 10 : 0;
    if (isCorrect) {
      setScore(score + points);
    }

    await submitAnswer({
      clipId: currentClip.id,
      userInput,
      correct: isCorrect,
      points
    });
  };

  const handleNext = async () => {
    setUserInput('');
    setFeedback(null);
    if (currentRound + 1 >= audioClips.length) {
      await completeGame();
    }
    setCurrentRound(currentRound + 1);
  };

  if (isComplete) {
    return (
      <GameLayout title="Transcription Station">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{score} / {audioClips.length * 10}</span></p>
          <p className="text-gray-600 mb-8">Great job! You've completed all transcriptions.</p>
          <button
            onClick={startNewGame}
            className="btn-primary"
          >
            Play Again
          </button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Transcription Station" score={score} progress={`${currentRound + 1}/${audioClips.length}`}>
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
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:shadow-lg transition-all mb-6"
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
                    <p className="text-sm text-red-800">Correct answer: {currentClip.text}</p>
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
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
