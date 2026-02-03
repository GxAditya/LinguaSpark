import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Check, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { GameLoading, GameError } from '../components/GameStates';
import { useGameSession } from '../hooks/useGameSession';
import { getLearningLanguageLabel, getLearningLanguageMeta } from '../utils/languages';

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
    loading,
    error,
    showExitConfirm,
    setShowExitConfirm,
    confirmExit,
    cancelExit,
    updateScore,
    completeGame,
    startNewGame,
    targetLanguage,
    gameState: { feedback, setFeedback },
  } = useGameSession({
    gameType: 'translation-matchup',
    difficulty: 'beginner',
  });

  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [hasSubmittedCompletion, setHasSubmittedCompletion] = useState(false);
  const evaluateLockRef = useRef(false);
  const flipBackTimeoutRef = useRef<number | null>(null);

  const pairs: TranslationPair[] = useMemo(() => {
    const rawPairs = (content as { pairs?: TranslationPair[] } | null)?.pairs;
    return Array.isArray(rawPairs) ? rawPairs : [];
  }, [content]);

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
  const learningLanguageLabel = getLearningLanguageLabel(targetLanguage);
  const learningLanguageMeta = getLearningLanguageMeta(targetLanguage);

  useEffect(() => {
    // Reset local state when new content loads
    setFlippedCards([]);
    setMatchedCards([]);
    setHasSubmittedCompletion(false);
    evaluateLockRef.current = false;

    if (flipBackTimeoutRef.current) {
      window.clearTimeout(flipBackTimeoutRef.current);
      flipBackTimeoutRef.current = null;
    }

    setFeedback(null);
  }, [pairs, setFeedback]);

  useEffect(() => {
    // Cleanup any pending timeout on unmount
    return () => {
      if (flipBackTimeoutRef.current) {
        window.clearTimeout(flipBackTimeoutRef.current);
        flipBackTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!allMatched || hasSubmittedCompletion) return;
    setHasSubmittedCompletion(true);
    void completeGame();
  }, [allMatched, hasSubmittedCompletion, completeGame]);

  const handleCardClick = (cardId: number) => {
    if (evaluateLockRef.current) return;
    if (matchedCards.includes(cardId)) return;
    if (flippedCards.includes(cardId)) return;
    if (flippedCards.length >= 2) return;

    const nextFlipped = [...flippedCards, cardId];
    setFlippedCards(nextFlipped);

    if (nextFlipped.length !== 2) return;
    evaluateLockRef.current = true;

    const [firstId, secondId] = nextFlipped;
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);

    const isMatch =
      !!firstCard &&
      !!secondCard &&
      firstCard.pairId === secondCard.pairId &&
      firstCard.isOriginal !== secondCard.isOriginal;

    if (isMatch) {
      setFeedback('correct');
      setMatchedCards((prev) => [...prev, firstId, secondId]);
      updateScore(score + 10);
    } else {
      setFeedback('incorrect');
    }

    flipBackTimeoutRef.current = window.setTimeout(() => {
      setFlippedCards([]);
      setFeedback(null);
      evaluateLockRef.current = false;
      flipBackTimeoutRef.current = null;
    }, 900);
  };

  const handlePlayAgain = () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setFeedback(null);
    setHasSubmittedCompletion(false);
    evaluateLockRef.current = false;
    if (flipBackTimeoutRef.current) {
      window.clearTimeout(flipBackTimeoutRef.current);
      flipBackTimeoutRef.current = null;
    }
    startNewGame();
  };

  if (loading) {
    return <GameLoading message="Generating translation pairs..." />;
  }

  if (error) {
    return <GameError error={error} onRetry={startNewGame} />;
  }

  if (allMatched) {
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
              Match words with their translations — learning <span className="font-semibold text-gray-900">{learningLanguageLabel}</span>.
            </p>

            <div className="grid grid-cols-4 gap-3 mb-8">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={matchedCards.includes(card.id)}
                  lang={card.isOriginal ? learningLanguageMeta.bcp47 : 'en'}
                  dir={card.isOriginal ? learningLanguageMeta.dir : 'ltr'}
                  className={`aspect-square rounded-xl font-semibold text-sm transition-all flex items-center justify-center p-2 ${matchedCards.includes(card.id)
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
                className={`p-4 rounded-xl mb-6 flex items-center justify-center ${feedback === 'correct'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
                  }`}
              >
                {feedback === 'correct' ? (
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
              <button onClick={() => setShowExitConfirm(true)} className="btn-secondary flex items-center gap-2">
                Finish <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </GameLayout>

      <ExitConfirmModal
        isOpen={showExitConfirm}
        onCancel={cancelExit}
        onConfirm={confirmExit}
        title="Finish game early?"
        message="You haven't matched all pairs yet. If you finish now, your progress will be lost."
        confirmText="Yes, finish"
        cancelText="Keep playing"
      />
    </>
  );
}
