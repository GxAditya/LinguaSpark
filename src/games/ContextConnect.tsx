import { useState, useEffect } from 'react';
import { ChevronRight, Check, X, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { GameLoading, GameError } from '../components/GameStates';
import { useGameSession } from '../hooks/useGameSession';
import { getLearningLanguageMeta } from '../utils/languages';

interface BlankData {
  position: number;
  correctWord: string;
  options: string[];
}

interface PassageData {
  text: string;
  blanks: BlankData[];
}

export default function ContextConnect() {
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
    targetLanguage,
  } = useGameSession({
    gameType: 'context-connect',
    difficulty: 'beginner',
    autoSave: false,
  });

  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const passages: PassageData[] = (content as any)?.passages || [];
  const currentPassage = passages[currentRound];
  const languageMeta = getLearningLanguageMeta(targetLanguage);

  // Reset local state when round changes
  useEffect(() => {
    setAnswers([]);
    setFeedback(null);
  }, [currentRound]);

  if (loading) {
    return <GameLoading message="Generating context exercises..." />;
  }

  if (error) {
    return <GameError error={error} onRetry={startNewGame} />;
  }

  const allAnswered =
    currentPassage &&
    answers.length === currentPassage.blanks.length &&
    answers.every((a) => a !== null);

  const handleSelectOption = (blankIndex: number, optionIndex: number) => {
    if (feedback === null) {
      const newAnswers = [...answers];
      newAnswers[blankIndex] = optionIndex;
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    if (!currentPassage) return;

    let allCorrect = true;
    for (let i = 0; i < currentPassage.blanks.length; i++) {
      const blank = currentPassage.blanks[i];
      const selectedIndex = answers[i];
      if (selectedIndex === null || blank.options[selectedIndex] !== blank.correctWord) {
        allCorrect = false;
        break;
      }
    }

    setFeedback(allCorrect ? 'correct' : 'incorrect');
    if (allCorrect) {
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
      <GameLayout title="Context Connect">
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
            <Link to="/games" className="btn-secondary px-6 py-3">
              Back to Games
            </Link>
            <button onClick={handlePlayAgain} className="btn-primary px-6 py-3 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (!currentPassage) {
    return <GameLoading message="Loading passage..." />;
  }

  return (
    <>
      <GameLayout
        title="Context Connect"
        score={score}
        progress={`${currentRound + 1}/${totalRounds}`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 mb-8">
            <p className="text-sm text-gray-600 mb-8">
              Fill in the blanks with the most contextually appropriate word:
            </p>

            <div className="bg-rose-50 rounded-xl p-6 mb-8 border-2 border-rose-200">
              <p
                className="text-lg text-gray-800 mb-6 leading-relaxed"
                lang={languageMeta.bcp47}
                dir={languageMeta.dir}
              >
                {currentPassage.text}
              </p>

              {currentPassage.blanks.map((blank, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <p className="text-sm text-gray-600 mb-3 font-medium">Blank {idx + 1}:</p>
                  <div className="grid grid-cols-2 gap-2 ml-4">
                    {blank.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(idx, optIdx)}
                        disabled={feedback !== null}
                        className={`p-3 rounded-lg text-left font-medium transition-all ${answers[idx] === optIdx
                            ? feedback === null
                              ? 'bg-rose-300 text-rose-900'
                              : option === blank.correctWord
                                ? 'bg-green-200 text-green-900'
                                : 'bg-red-200 text-red-900'
                            : feedback !== null && option === blank.correctWord
                              ? 'bg-green-200 text-green-900'
                              : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                          } ${feedback !== null ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span lang={languageMeta.bcp47} dir={languageMeta.dir}>
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${feedback === 'correct'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                  }`}
              >
                {feedback === 'correct' ? (
                  <>
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900">All correct!</p>
                      <p className="text-sm text-green-800">You earned 10 points!</p>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900">Not quite right</p>
                      <p className="text-sm text-red-800">
                        Correct answers:{' '}
                        {currentPassage.blanks.map((b) => b.correctWord).join(', ')}
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
                  disabled={!allAnswered}
                  className="btn-primary px-6 py-3 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="btn-primary px-6 py-3 flex-1 flex items-center justify-center gap-2"
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
              className="btn-ghost px-4 py-2 text-sm"
            >
              Finish Game
            </button>
          </div>
        </div>
      </GameLayout>

      <ExitConfirmModal
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={confirmExit}
        title="Finish Game Early?"
        message="If you finish now, this game will end and your current progress will be abandoned. Do you want to finish anyway?"
        cancelText="Keep Playing"
        confirmText="Finish Game"
      />
    </>
  );
}
