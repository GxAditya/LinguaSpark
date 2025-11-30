import React, { useState, useEffect } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import GameLayout from '../components/GameLayout';
import { useGameSession } from '../hooks/useGameSession';
import { GameLoading, GameError } from '../components/GameStates';
import ExitConfirmModal from '../components/ExitConfirmModal';

interface Round {
  words: string[];
  targets: string[];
  timeLimit: number;
}

interface WordDropDashContent {
  rounds: Round[];
}

export default function WordDropDash() {
  const {
    session,
    loading,
    error,
    showExitConfirm,
    setShowExitConfirm,
    submitAnswer,
    completeGame,
    confirmExit,
    cancelExit,
    startNewGame
  } = useGameSession('word-drop-dash');

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);

  const content = session?.content as WordDropDashContent | undefined;
  const rounds = content?.rounds || [];
  const isComplete = currentRound >= rounds.length;

  if (loading) return <GameLoading gameName="Word Drop Dash" />;
  if (error) return <GameError error={error} onRetry={startNewGame} />;
  if (!session || !content) return <GameLoading gameName="Word Drop Dash" />;

  if (isComplete) {
    return (
      <GameLayout title="Word Drop Dash">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">{score}</span></p>
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

  const handleScore = async () => {
    const points = 10;
    setScore(score + points);
    setRoundComplete(true);

    await submitAnswer({
      roundIndex: currentRound,
      correct: true,
      points
    });
  };

  const handleNext = async () => {
    if (currentRound + 1 >= rounds.length) {
      await completeGame();
    }
    setCurrentRound(currentRound + 1);
    setRoundComplete(false);
  };

  return (
    <GameLayout title="Word Drop Dash" score={score} progress={`${currentRound + 1}/${rounds.length}`}>
      <ExitConfirmModal
        isOpen={showExitConfirm}
        onConfirm={confirmExit}
        onCancel={cancelExit}
      />
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 mb-8">
          <p className="text-sm text-gray-600 mb-8">Drag falling words to match with the correct target!</p>

          <div className="bg-gradient-to-b from-yellow-50 to-orange-50 rounded-xl p-8 mb-8 min-h-64 flex flex-col items-center justify-center border-4 border-dashed border-yellow-300">
            <p className="text-center text-gray-600 mb-6">
              This is a timed interactive game. In a full implementation, words would fall from the top and you'd drag them to targets.
            </p>
            <div className="flex gap-4">
              {rounds[currentRound].targets.map((target, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl mb-2">{target}</div>
                  <p className="text-sm text-gray-600">{rounds[currentRound].words[idx]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-8 border border-yellow-200">
            <p className="text-sm text-gray-600">Time Limit: {rounds[currentRound].timeLimit}s</p>
            <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
              <div className="bg-yellow-500 h-2 rounded-full w-2/3 animate-pulse"></div>
            </div>
          </div>

          {!roundComplete ? (
            <button
              onClick={handleScore}
              className="btn-primary w-full"
            >
              Complete Round (Demo)
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
