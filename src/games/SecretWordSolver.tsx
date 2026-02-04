import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Check, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { GameLoading, GameError } from '../components/GameStates';
import { useGameSession } from '../hooks/useGameSession';
import { getLearningLanguageMeta, type LearningLanguage } from '../utils/languages';

interface SecretWord {
  word: string;
  hint: string;
  category: string;
}

function splitGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    // @ts-expect-error TS lib may not include Intl.Segmenter depending on config
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    // @ts-expect-error TS lib may not include Intl.Segmenter depending on config
    return Array.from(segmenter.segment(text), (s: any) => s.segment);
  }
  return Array.from(text);
}

function normalizeSegment(value: string): string {
  return value.normalize('NFC').toLocaleUpperCase();
}

function getKeyboardPool(language: LearningLanguage): string[] {
  switch (language) {
    case 'russian':
      return 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
    case 'arabic':
      return 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
    case 'hindi':
      return 'अआइईउऊएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह'.split('');
    case 'bengali':
      return 'অআইঈউঊএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়'.split('');
    case 'japanese':
      return 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'.split('');
    case 'mandarin':
      return '我你他她是的不了在有这那吗呢和说去来吃喝学会想看听喜欢今天明天昨天'.split('');
    case 'spanish':
      return 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    case 'french':
    case 'portuguese':
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇ'.split('');
    default:
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  }
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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
    targetLanguage,
  } = useGameSession({
    gameType: 'secret-word-solver',
    difficulty: 'beginner',
  });

  const [guessedChars, setGuessedChars] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);

  const maxWrongs = 6;
  const languageMeta = getLearningLanguageMeta(targetLanguage);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const words: SecretWord[] = useMemo(() => (content as any)?.words || [], [content]);
  const currentWordData = words[currentRound];
  const rawWord = currentWordData?.word?.trim() || '';
  const normalizedWord = rawWord.normalize('NFC');

  // Reset local state when round changes
  useEffect(() => {
    setGuessedChars([]);
    setWrongGuesses(0);
  }, [currentRound, normalizedWord]);

  const wordSegments = useMemo(() => splitGraphemes(normalizedWord), [normalizedWord]);
  const normalizedSegments = useMemo(() => wordSegments.map(normalizeSegment), [wordSegments]);
  const guessableMask = useMemo(() => wordSegments.map((seg) => /[\p{L}\p{N}]/u.test(seg)), [wordSegments]);

  const wordGuessSet = useMemo(() => {
    const set = new Set<string>();
    normalizedSegments.forEach((seg, idx) => {
      if (guessableMask[idx]) set.add(seg);
    });
    return set;
  }, [guessableMask, normalizedSegments]);

  const requiredCharsForWord = useMemo(() => {
    const seen = new Set<string>();
    const required: string[] = [];
    normalizedSegments.forEach((seg, idx) => {
      if (!guessableMask[idx]) return;
      if (seen.has(seg)) return;
      seen.add(seg);
      required.push(wordSegments[idx]);
    });
    return required;
  }, [guessableMask, normalizedSegments, wordSegments]);

  const keyboardChars = useMemo(() => {
    const basePool = getKeyboardPool(languageMeta.language);
    const requiredSet = new Set(requiredCharsForWord.map(normalizeSegment));
    const poolCandidates = basePool.filter((ch) => !requiredSet.has(normalizeSegment(ch)));

    // Balance: always include all required chars, then add distractors.
    const desiredSize = Math.min(Math.max(requiredCharsForWord.length + 10, 18), 30);
    const distractors = shuffle(poolCandidates).slice(0, Math.max(0, desiredSize - requiredCharsForWord.length));
    return shuffle([...requiredCharsForWord, ...distractors]);
  }, [languageMeta.language, requiredCharsForWord]);

  const guessedWord = useMemo(() => {
    return wordSegments
      .map((seg, idx) => {
        if (!guessableMask[idx]) return seg;
        const normalized = normalizedSegments[idx];
        return guessedChars.includes(normalized) ? seg : '_';
      })
      .join(' ');
  }, [guessableMask, guessedChars, normalizedSegments, wordSegments]);

  const isWordComplete = useMemo(() => {
    return wordSegments.every((_, idx) => !guessableMask[idx] || guessedChars.includes(normalizedSegments[idx]));
  }, [guessableMask, guessedChars, normalizedSegments, wordSegments]);

  const isGameOver = wrongGuesses >= maxWrongs;

  const handleGuess = (letter: string) => {
    if (isGameOver || isWordComplete) return;

    const normalized = normalizeSegment(letter);
    if (guessedChars.includes(normalized)) return;

    setGuessedChars((prev) => [...prev, normalized]);
    if (!wordGuessSet.has(normalized)) {
      setWrongGuesses((prev) => prev + 1);
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

  if (loading) {
    return <GameLoading message="Generating secret words..." />;
  }

  if (error) {
    return <GameError error={error} onRetry={startNewGame} />;
  }

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
                <div
                  className="text-4xl md:text-5xl font-bold tracking-widest text-gray-900 mb-4 font-mono"
                  lang={languageMeta.bcp47}
                  dir={languageMeta.dir}
                >
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
                  <p className="text-sm text-red-800" lang={languageMeta.bcp47} dir={languageMeta.dir}>
                    The word was: {normalizedWord}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-3 font-medium">Guessed Letters:</p>
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {guessedChars.map((letter) => (
                  <span
                    key={letter}
                    className={`px-3 py-1 rounded-lg font-medium text-sm ${wordGuessSet.has(letter)
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
                  {keyboardChars.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleGuess(letter)}
                      disabled={guessedChars.includes(normalizeSegment(letter))}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${guessedChars.includes(normalizeSegment(letter))
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
