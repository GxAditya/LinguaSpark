import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Check, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { GameLoading, GameError } from '../components/GameStates';
import { useGameSession } from '../hooks/useGameSession';

interface TranslationPair {
  original: string;
  translation: string;
}

interface Card {
  id: number;
  text: string;
  pairId: number;
  isOriginal: boolean;
}

export default function TranslationMatchUp() {
  const {
    content,
    score,
    isLoading,
    error,
    isComplete,
    showExitConfirm,
    setShowExitConfirm,
    confirmExit,
    updateScore,
    completeGame,
    startNewGame,
  } = useGameSession({
    gameType: 'translation-matchup',
    difficulty: 'beginner',
  });

  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'match' | 'mismatch' | null>(null);

  const pairs: TranslationPair[] = content?.pairs || [];

  // Shuffle cards for display
  const cards: Card[] = useMemo(() => {
    const allCards = pairs.flatMap((pair, idx) => [
      { id: idx * 2, text: pair.original, pairId: idx, isOriginal: true },
      { id: idx * 2 + 1, text: pair.translation, pairId: idx, isOriginal: false },
    ]);
    // Shuffle the cards
    return allCards.sort(() => Math.random() - 0.5);
  }, [pairs]);

  const allMatched = matchedCards.length === cards.length && cards.length > 0;
  const maxScore = pairs.length * 10;

  useEffect(() => {
    if (flippedCards.length === 2) {
      const card1 = cards.find((c) => c.id === flippedCards[0]);
      const card2 = cards.find((c) => c.id === flippedCards[1]);

      if (card1 && card2 && card1.pairId === card2.pairId && card1.isOriginal !== card2.isOriginal) {
        setFeedback('match');
        setMatchedCards([...matchedCards, ...flippedCards]);
        updateScore(score + 10);
      } else {
        setFeedback('mismatch');
      }

      setTimeout(() => {
        if (!card1 || !card2 || card1.pairId !== card2.pairId) {
          setFlippedCards([]);
        }
        setFeedback(null);
      }, 1000);
    }
  }, [flippedCards, cards, matchedCards, score, updateScore]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length < 2 && !flippedCards.includes(cardId) && !matchedCards.includes(cardId)) {
      setFlippedCards([...flippedCards, cardId]);
    }
  };

  const handleComplete = async () => {
    await completeGame();
  };

  const handlePlayAgain = () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setFeedback(null);
    startNewGame();
  };

  if (isLoading) {
    return <GameLoading message="Generating translation pairs..." />;
  }

  if (error) {
    return <GameError error={error} onRetry={startNewGame} />;
  }

  if (isComplete) {
    return (
      <GameLayout title="Translation Match-Up">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">
            Final Score:{' '}
            <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              {score} / {maxScore}
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

  if (cards.length === 0) {
    return <GameLoading message="Loading cards..." />;
  }

  return (
    <>
      <GameLayout title="Translation Match-Up" score={score} progress={`${matchedCards.length / 2}/${pairs.length}`}>
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 mb-8">
            <p className="text-sm text-gray-600 mb-8">
              Match words with their translations!
            </p>

            <div className="grid grid-cols-4 gap-3 mb-8">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={matchedCards.includes(card.id)}
                  className={`aspect-square rounded-xl font-semibold text-sm transition-all flex items-center justify-center p-2 ${
                    matchedCards.includes(card.id)
                      ? 'bg-green-100 text-green-600 cursor-default'
                      : flippedCards.includes(card.id)
                      ? 'bg-orange-500 text-white scale-105'
                      : 'bg-gradient-to-br from-orange-100 to-pink-100 text-gray-700 hover:scale-105 cursor-pointer'
                  }`}
                >
                  {flippedCards.includes(card.id) || matchedCards.includes(card.id)
                    ? card.text
                    : '?'}
                </button>
              ))}
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-xl mb-6 flex items-center justify-center ${
                  feedback === 'match'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {feedback === 'match' ? (
                  <p className="font-semibold text-green-900">Match found! +10 points</p>
                ) : (
                  <p className="font-semibold text-red-900">No match, try again!</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Matched: {matchedCards.length / 2} / {pairs.length}
              </p>
              {allMatched && (
                <button onClick={handleComplete} className="btn-primary flex items-center gap-2">
                  Finish <ChevronRight className="w-4 h-4" />
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
