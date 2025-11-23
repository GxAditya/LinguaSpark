import React, { useState } from 'react';
import { ChevronRight, Check, X } from 'lucide-react';
import GameLayout from '../components/GameLayout';

export default function SecretWordSolver() {
  const [currentRound, setCurrentRound] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const words = ['BUTTERFLY', 'LANGUAGE', 'ELEPHANT', 'ADVENTURE', 'TREASURE'];
  const currentWord = words[currentRound];
  const maxWrongs = 6;
  const isComplete = currentRound >= words.length;

  const guessedWord = currentWord
    .split('')
    .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
    .join('');

  const isWordComplete = guessedWord === currentWord;
  const isGameOver = wrongGuesses >= maxWrongs;

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleGuess = (letter: string) => {
    if (!guessedLetters.includes(letter) && !isGameOver && !isWordComplete) {
      setGuessedLetters([...guessedLetters, letter]);

      if (!currentWord.includes(letter)) {
        setWrongGuesses(wrongGuesses + 1);
        setFeedback('incorrect');
      } else {
        setFeedback('correct');
      }

      setTimeout(() => setFeedback(null), 500);
    }
  };

  const handleNext = () => {
    if (isWordComplete) {
      setScore(score + 10);
    }
    setCurrentRound(currentRound + 1);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setFeedback(null);
  };

  if (isComplete) {
    return (
      <GameLayout title="Secret Word Solver">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold text-orange-600">{score} / {words.length * 10}</span></p>
          <button
            onClick={() => {
              setCurrentRound(0);
              setGuessedLetters([]);
              setWrongGuesses(0);
              setFeedback(null);
              setScore(0);
            }}
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Secret Word Solver" score={score} progress={`${currentRound + 1}/${words.length}`}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold tracking-widest text-gray-900 mb-4 font-mono">
                {guessedWord}
              </div>
              <p className="text-sm text-gray-600">Guess the hidden word!</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
              <p className="text-sm text-gray-600 mb-2">Wrong Guesses: {wrongGuesses}/{maxWrongs}</p>
              <div className="w-full bg-red-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full transition-all"
                  style={{ width: `${(wrongGuesses / maxWrongs) * 100}%` }}
                ></div>
              </div>
            </div>

            {isWordComplete && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                <p className="font-semibold text-green-900">You won! +10 points</p>
              </div>
            )}

            {isGameOver && !isWordComplete && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                <p className="font-semibold text-red-900">Game Over!</p>
                <p className="text-sm text-red-800">The word was: {currentWord}</p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-3 font-medium">Guessed Letters:</p>
            <div className="flex flex-wrap gap-2">
              {guessedLetters.map(letter => (
                <span
                  key={letter}
                  className={`px-3 py-1 rounded-lg font-medium text-sm ${
                    currentWord.includes(letter)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {!isWordComplete && !isGameOver && (
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-3 font-medium">Available Letters:</p>
              <div className="flex flex-wrap gap-2">
                {alphabet.map(letter => (
                  <button
                    key={letter}
                    onClick={() => handleGuess(letter)}
                    disabled={guessedLetters.includes(letter)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      guessedLetters.includes(letter)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(isWordComplete || isGameOver) && (
            <button
              onClick={handleNext}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
