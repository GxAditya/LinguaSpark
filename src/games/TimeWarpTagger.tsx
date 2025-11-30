import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, X, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { GameLoading, GameError } from '../components/GameStates';
import { useGameSession } from '../hooks/useGameSession';

interface TimeWarpQuestion {
  sentence: string;
  timeReference: string;
  verb: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function TimeWarpTagger() {
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
    gameType: 'time-warp-tagger',
    difficulty: 'beginner',
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Reset local state when round changes
  useEffect(() => {
    setSelectedAnswer(null);
    setFeedback(null);
  }, [currentRound]);

  if (isLoading) {
    return <GameLoading message="Generating time-based exercises..." />;
  }

  if (error) {
    return <GameError error={error} onRetry={startNewGame} />;
  }

  const questions: TimeWarpQuestion[] = content?.questions || [];
  const currentQuestion = questions[currentRound];

  const handleSelectAnswer = (index: number) => {
    if (feedback === null && currentQuestion) {
      setSelectedAnswer(index);
      const isCorrect = index === currentQuestion.correctIndex;
      setFeedback(isCorrect ? 'correct' : 'incorrect');

      if (isCorrect) {
        updateScore(score + 10);
      }
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
      <GameLayout title="Time Warp Tagger">
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

  if (!currentQuestion) {
    return <GameLoading message="Loading question..." />;
  }

  return (
    <>
      <GameLayout
        title="Time Warp Tagger"
        score={score}
        progress={`${currentRound + 1}/${totalRounds}`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 mb-8">
            <p className="text-sm text-gray-600 mb-8">
              Select the correct verb tense based on the time reference:
            </p>

            <div className="bg-violet-50 rounded-xl p-6 mb-4 border-2 border-violet-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-lg">🕐</span>
                <span className="px-4 py-2 bg-violet-200 rounded-full font-semibold text-violet-900">
                  {currentQuestion.timeReference}
                </span>
              </div>
              <p className="text-lg text-gray-900 font-medium">{currentQuestion.sentence}</p>
              {currentQuestion.verb && (
                <p className="text-sm text-violet-600 mt-2">
                  Verb: <span className="font-semibold">{currentQuestion.verb}</span>
                </p>
              )}
            </div>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={feedback !== null}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition-all ${
                    selectedAnswer === index
                      ? feedback === 'correct'
                        ? 'bg-green-100 border-2 border-green-500 text-green-900'
                        : 'bg-red-100 border-2 border-red-500 text-red-900'
                      : index === currentQuestion.correctIndex && feedback === 'incorrect'
                      ? 'bg-green-100 border-2 border-green-500 text-green-900'
                      : 'bg-violet-100 border-2 border-violet-300 text-violet-900 hover:bg-violet-200'
                  } ${feedback !== null ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {option}
                </button>
              ))}
            </div>

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
                      <p className="font-semibold text-green-900">Correct!</p>
                      <p className="text-sm text-green-800">{currentQuestion.explanation}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900">Not quite right</p>
                      <p className="text-sm text-red-800">{currentQuestion.explanation}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {feedback && (
              <button
                onClick={handleNext}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {currentRound + 1 >= totalRounds ? 'Finish' : 'Next'}{' '}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
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
