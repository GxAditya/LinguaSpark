import { useMemo, useState, useEffect } from 'react';
import { ChevronRight, Check, X, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { GameLoading, GameError } from '../components/GameStates';
import { useGameSession } from '../hooks/useGameSession';

interface ConjugationQuestion {
  sentence: string;
  blankedSentence?: string;
  answer?: string;
  verb: string;
  tense: string;
  subject: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const BLANK_PATTERN = /_{3,}/;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildBlankedSentence(question: ConjugationQuestion | undefined): string {
  if (!question) return '';
  const rawSentence = question.sentence?.trim() ?? '';
  const answer = (question.answer || question.options?.[question.correctIndex] || '').trim();

  const blankedFromModel = question.blankedSentence?.trim() ?? '';
  const rawHasBlank = BLANK_PATTERN.test(rawSentence);
  const rawHasAnswer = !!answer && rawSentence.includes(answer);
  const blankedHasBlank = BLANK_PATTERN.test(blankedFromModel);
  const blankedHasAnswer = !!answer && blankedFromModel.includes(answer);

  const replaceLastOccurrence = (sentence: string, needle: string) => {
    const idx = sentence.lastIndexOf(needle);
    if (idx < 0) return sentence;
    return `${sentence.slice(0, idx)}_____${sentence.slice(idx + needle.length)}`.replace(/\s+/g, ' ').trim();
  };

  if (blankedHasBlank && !blankedHasAnswer) {
    return blankedFromModel;
  }

  if (rawHasAnswer) {
    const cleaned = rawSentence.replace(BLANK_PATTERN, '').replace(/\s+/g, ' ').trim();
    const fixed = replaceLastOccurrence(cleaned, answer);
    if (fixed && fixed.includes('_____')) return fixed;
  }

  if (blankedHasBlank && blankedHasAnswer) {
    const cleaned = blankedFromModel.replace(BLANK_PATTERN, '').replace(/\s+/g, ' ').trim();
    const fixed = replaceLastOccurrence(cleaned, answer);
    if (fixed && fixed.includes('_____')) return fixed;
  }

  if (rawHasBlank) {
    return rawSentence;
  }

  if (blankedHasBlank) {
    return blankedFromModel;
  }

  if (answer && rawSentence) {
    const fixed = replaceLastOccurrence(rawSentence, answer);
    if (fixed && fixed.includes('_____')) return fixed;
  }

  return rawSentence ? `${rawSentence} _____` : '_____';
}

export default function ConjugationCoach() {
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
    gameType: 'conjugation-coach',
    difficulty: 'beginner',
    autoSave: false,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Reset local state when round changes
  useEffect(() => {
    setSelectedAnswer(null);
    setFeedback(null);
  }, [currentRound]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const questions: ConjugationQuestion[] = (content as any)?.questions || [];
  const currentQuestion = questions[currentRound];
  const displaySentence = useMemo(() => buildBlankedSentence(currentQuestion), [currentQuestion]);

  if (loading) {
    return <GameLoading message="Generating conjugation exercises..." />;
  }

  if (error) {
    return <GameError error={error} onRetry={startNewGame} />;
  }

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
      <GameLayout title="Conjugation Coach">
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
          <p className="text-gray-500 mb-6">
            Accuracy: {totalRounds > 0 ? Math.round((score / (totalRounds * 10)) * 100) : 0}%
          </p>
          <div className="flex gap-4">
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

  if (!currentQuestion) {
    return <GameLoading message="Loading question..." />;
  }

  return (
    <>
      <GameLayout
        title="Conjugation Coach"
        score={score}
        progress={`${currentRound + 1}/${totalRounds}`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 mb-8">
            <p className="text-sm text-gray-600 mb-8">Select the correct verb conjugation:</p>

            <div className="bg-teal-50 rounded-xl p-6 mb-8 border-2 border-teal-200">
              <p className="text-lg text-gray-900 font-medium">{displaySentence}</p>
              {(currentQuestion.tense || currentQuestion.subject) && (
                <p className="text-sm text-teal-600 mt-2">
                  {currentQuestion.tense && <span className="font-semibold">{currentQuestion.tense}</span>}
                  {currentQuestion.tense && currentQuestion.subject && ' • '}
                  {currentQuestion.subject && <span className="font-semibold">{currentQuestion.subject}</span>}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={feedback !== null}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition-all ${selectedAnswer === index
                      ? feedback === 'correct'
                        ? 'bg-green-100 border-2 border-green-500 text-green-900'
                        : 'bg-red-100 border-2 border-red-500 text-red-900'
                      : index === currentQuestion.correctIndex && feedback === 'incorrect'
                        ? 'bg-green-100 border-2 border-green-500 text-green-900'
                        : 'bg-teal-100 border-2 border-teal-300 text-teal-900 hover:bg-teal-200'
                    } ${feedback !== null ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {option}
                </button>
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
                className="btn-primary px-6 py-3 w-full flex items-center justify-center gap-2"
              >
                {currentRound + 1 >= totalRounds ? 'Finish' : 'Next'}{' '}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
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
