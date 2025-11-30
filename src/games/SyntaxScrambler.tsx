import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Check, X, RefreshCw, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { GameLoading, GameError } from '../components/GameStates';
import { useGameSession } from '../hooks/useGameSession';

interface SentenceData {
  scrambled: string[];
  correct: string;
  translation: string;
}

export default function SyntaxScrambler() {
  const {
    content,
    currentRound,
    totalRounds,
    score,
    isLoading,
    error,
    isComplete,
    showExitConfirm,
    setShowExitConfirm,
    confirmExit,
    updateScore,
    nextRound,
    completeGame,
    startNewGame,
  } = useGameSession({
    gameType: 'syntax-scrambler',
    difficulty: 'beginner',
  });

  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const sentences: SentenceData[] = content?.sentences || [];
  const currentSentence = sentences[currentRound];

  // Shuffle indices for display
  const shuffledIndices = useMemo(() => {
    if (!currentSentence?.scrambled) return [];
    const indices = Array.from({ length: currentSentence.scrambled.length }, (_, i) => i);
    return indices.sort(() => Math.random() - 0.5);
  }, [currentRound, currentSentence]);

  // Reset local state when round changes
  useEffect(() => {
    setSelectedOrder([]);
    setFeedback(null);
  }, [currentRound]);

  if (isLoading) {
    return <GameLoading message="Generating scrambled sentences..." />;
  }

  if (error) {
    return <GameError error={error} onRetry={startNewGame} />;
  }

  const handleToggleWord = (index: number) => {
    if (feedback) return;
    
    if (selectedOrder.includes(index)) {
      setSelectedOrder(selectedOrder.filter((i) => i !== index));
    } else {
      setSelectedOrder([...selectedOrder, index]);
    }
  };

  const handleClear = () => {
    setSelectedOrder([]);
  };

  const handleSubmit = () => {
    if (!currentSentence) return;
    
    const userSentence = selectedOrder.map((i) => currentSentence.scrambled[i]).join(' ');
    const isCorrect = userSentence.toLowerCase() === currentSentence.correct.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      updateScore(score + 10);
    }
  };

  const handleNext = async () => {
    if (currentRound + 1 >= totalRounds) {
      await completeGame();
    } else {
      nextRound();
    }
  };

  const handlePlayAgain = () => {
    startNewGame();
  };

  if (isComplete) {
    return (
      <GameLayout title="Syntax Scrambler">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">
            Final Score:{' '}
            <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              {score} / {totalRounds * 10}
            </span>
          </p>
          <div className="flex gap-4 mt-4">
            <Link to="/games" className="btn-secondary">
              Back to Games
            </Link>
            <button onClick={handlePlayAgain} className="btn-primary flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (!currentSentence) {
    return <GameLoading message="Loading sentence..." />;
  }

  return (
    <>
      <GameLayout
        title="Syntax Scrambler"
        score={score}
        progress={`${currentRound + 1}/${totalRounds}`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 mb-8">
            <p className="text-sm text-gray-600 mb-6">
              Arrange the words in the correct grammatical order:
            </p>

            {currentSentence.translation && (
              <div className="mb-8 p-4 bg-sky-50 rounded-lg border-2 border-sky-200">
                <p className="text-sm text-gray-600 mb-1 font-medium">Translation:</p>
                <p className="text-lg font-semibold text-gray-900">{currentSentence.translation}</p>
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  Click words to arrange them in order:
                </label>
                {selectedOrder.length > 0 && !feedback && (
                  <button
                    onClick={handleClear}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {shuffledIndices.map((wordIndex) => (
                  <button
                    key={wordIndex}
                    onClick={() => handleToggleWord(wordIndex)}
                    disabled={feedback !== null}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedOrder.includes(wordIndex)
                        ? 'bg-sky-500 text-white'
                        : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                    } ${feedback !== null ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {currentSentence.scrambled[wordIndex]}
                    {selectedOrder.includes(wordIndex) && (
                      <span className="ml-2 text-xs opacity-75">
                        {selectedOrder.indexOf(wordIndex) + 1}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedOrder.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2 font-medium">Your sentence:</p>
                <p className="text-lg text-gray-900">
                  {selectedOrder.map((i) => currentSentence.scrambled[i]).join(' ')}
                </p>
              </div>
            )}

            {feedback && (
              <div
                className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
                  feedback === 'correct'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {feedback === 'correct' ? (
                  <>
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900">Perfect syntax!</p>
                      <p className="text-sm text-green-800">You earned 10 points!</p>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900">Not quite right</p>
                      <p className="text-sm text-red-800">
                        Correct answer: {currentSentence.correct}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-3">
              {!feedback ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedOrder.length !== currentSentence.scrambled.length}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {currentRound + 1 >= totalRounds ? 'Finish' : 'Next'}{' '}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowExitConfirm(true)}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Exit Game
            </button>
          </div>
        </div>
      </GameLayout>

      <ExitConfirmModal
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={confirmExit}
      />
    </>
  );
}
