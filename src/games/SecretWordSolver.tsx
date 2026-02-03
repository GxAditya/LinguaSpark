import { useState, useEffect } from 'react';
import { ChevronRight, Check, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { GameLoading, GameError } from '../components/GameStates';
import { useGameSession } from '../hooks/useGameSession';

interface SecretWord {
  word: string;
  hint: string;
  category: string;
}

export default function SecretWordSolver() {
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
    confirmExit,
    updateScore,
    nextRound,
    completeGame,
    startNewGame,
  } = useGameSession({
    gameType: 'secret-word-solver',
    difficulty: 'beginner',
  });

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const maxWrongs = 6;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Reset local state when round changes
  useEffect(() => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setFeedback(null);
  }, [currentRound]);

  if (loading) {
    return <GameLoading message="Generating secret words..." />;
  }

  if (error) {
    return <GameError error={error} onRetry={startNewGame} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const words: SecretWord[] = (content as any)?.words || [];
  const currentWordData = words[currentRound];
  const currentWord = currentWordData?.word?.toUpperCase() || '';

  const guessedWord = currentWord
    .split('')
    .map((letter) => (guessedLetters.includes(letter) ? letter : '_'))
    .join(' ');

  const isWordComplete = currentWord.split('').every((letter) => guessedLetters.includes(letter));
  const isGameOver = wrongGuesses >= maxWrongs;

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

  const handleNext = async () => {
    if (isWordComplete) {
      const newScore = score + 10;
      updateScore(newScore);
    }

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
      <GameLayout title="Secret Word Solver">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">
            Final Score:{' '}
            <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
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

  if (!currentWordData) {
    return <GameLoading message="Loading word..." />;
  }

  return (
    <>
      <GameLayout
        title="Secret Word Solver"
        score={score}
        progress={`${currentRound + 1}/${totalRounds}`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 mb-8">
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="text-4xl md:text-5xl font-bold tracking-widest text-gray-900 mb-4 font-mono">
                  {guessedWord}
                </div>
                <p className="text-sm text-gray-600">Guess the hidden word!</p>
                {currentWordData.hint && (
                  <p className="text-sm text-indigo-600 mt-2">
                    Hint: {currentWordData.hint}
                  </p>
                )}
                {currentWordData.category && (
                  <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    {currentWordData.category}
                  </span>
                )}
              </div>

              <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
                <p className="text-sm text-gray-600 mb-2">
                  Wrong Guesses: {wrongGuesses}/{maxWrongs}
                </p>
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
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {guessedLetters.map((letter) => (
                  <span
                    key={letter}
                    className={`px-3 py-1 rounded-lg font-medium text-sm ${currentWord.includes(letter)
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
                  {alphabet.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleGuess(letter)}
                      disabled={guessedLetters.includes(letter)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${guessedLetters.includes(letter)
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
