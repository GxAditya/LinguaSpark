import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, X } from 'lucide-react';
import GameLayout from '../components/GameLayout';

export default function TranslationMatchUp() {
  const [currentRound, setCurrentRound] = useState(0);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'match' | 'mismatch' | null>(null);
  const [score, setScore] = useState(0);

  const rounds = [
    {
      pairs: [
        { english: 'Hello', spanish: 'Hola' },
        { english: 'Water', spanish: 'Agua' },
        { english: 'Bread', spanish: 'Pan' },
        { english: 'Book', spanish: 'Libro' }
      ]
    },
    {
      pairs: [
        { english: 'Happy', spanish: 'Feliz' },
        { english: 'Dog', spanish: 'Perro' },
        { english: 'House', spanish: 'Casa' },
        { english: 'Friend', spanish: 'Amigo' }
      ]
    }
  ];

  const currentRound_obj = rounds[currentRound];
  const cards = currentRound_obj.pairs.flatMap((pair, idx) => [
    { id: idx * 2, text: pair.english, pairId: idx, isEnglish: true },
    { id: idx * 2 + 1, text: pair.spanish, pairId: idx, isEnglish: false }
  ]);

  const isComplete = currentRound >= rounds.length;
  const allMatched = matchedCards.length === cards.length;

  useEffect(() => {
    if (flippedCards.length === 2) {
      const card1 = cards[flippedCards[0]];
      const card2 = cards[flippedCards[1]];

      if (card1.pairId === card2.pairId) {
        setFeedback('match');
        setMatchedCards([...matchedCards, ...flippedCards]);
        setScore(score + 10);
      } else {
        setFeedback('mismatch');
      }

      setTimeout(() => {
        if (card1.pairId !== card2.pairId) {
          setFlippedCards([]);
        }
        setFeedback(null);
      }, 1000);
    }
  }, [flippedCards]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length < 2 && !flippedCards.includes(index) && !matchedCards.includes(index)) {
      setFlippedCards([...flippedCards, index]);
    }
  };

  const handleNext = () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setFeedback(null);
    setCurrentRound(currentRound + 1);
  };

  if (isComplete) {
    return (
      <GameLayout title="Translation Match-Up">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">{score} / {rounds.length * 40}</span></p>
          <button
            onClick={() => {
              setCurrentRound(0);
              setFlippedCards([]);
              setMatchedCards([]);
              setFeedback(null);
              setScore(0);
            }}
            className="btn-primary"
          >
            Play Again
          </button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Translation Match-Up" score={score} progress={`${currentRound + 1}/${rounds.length}`}>
      <div className="max-w-3xl mx-auto">
        <div className="card p-8 mb-8">
          <p className="text-sm text-gray-600 mb-8">Match English words with their Spanish translations!</p>

          <div className="grid grid-cols-4 gap-3 mb-8">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={matchedCards.includes(index)}
                className={`aspect-square rounded-xl font-semibold text-sm transition-all ${
                  matchedCards.includes(index)
                    ? 'bg-green-100 text-green-600 cursor-default'
                    : flippedCards.includes(index)
                    ? 'bg-orange-500 text-white scale-105'
                    : 'bg-gradient-to-br from-orange-100 to-pink-100 text-gray-700 hover:scale-105 cursor-pointer'
                }`}
              >
                {flippedCards.includes(index) || matchedCards.includes(index) ? card.text : '?'}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`p-4 rounded-xl mb-6 flex items-center justify-center ${
              feedback === 'match'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {feedback === 'match' ? (
                <p className="font-semibold text-green-900">Match found!</p>
              ) : (
                <p className="font-semibold text-red-900">No match, try again!</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Matched: {matchedCards.length / 2} / {cards.length / 2}</p>
            {allMatched && (
              <button
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
