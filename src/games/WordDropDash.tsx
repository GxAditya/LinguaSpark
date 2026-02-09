import { useMemo, useState, useEffect } from 'react';
import { ChevronRight, Check, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import { useGameSession } from '../hooks/useGameSession';
import { GameLoading, GameError } from '../components/GameStates';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { getLearningLanguageMeta, type LearningLanguage } from '../utils/languages';

interface Round {
  words: Array<{
    word: string;
    translation: string;
    emoji: string;
  }>;
  timeLimit: number;
}

interface WordDropDashContent {
  rounds: Round[];
}

interface RoundWord {
  word: string;
  translation: string;
  emoji: string;
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

function stripCombiningMarks(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '');
}

function getInputUnits(segment: string, language: LearningLanguage, keyboardSet: Set<string>): string[] {
  if (!segment) return [];

  if (language === 'hindi' || language === 'bengali') {
    let base = stripCombiningMarks(segment);
    if (language === 'hindi') {
      base = base.replace(/\u094D/g, ''); // Devanagari virama
    }
    if (language === 'bengali') {
      base = base.replace(/\u09CD/g, ''); // Bengali virama
    }

    const units = splitGraphemes(base).filter((unit) => /[\p{L}\p{N}]/u.test(unit));
    return units.length > 0 ? units : [];
  }

  if (language === 'arabic') {
    const base = stripCombiningMarks(segment);
    const units = splitGraphemes(base).filter((unit) => /[\p{L}\p{N}]/u.test(unit));
    return units.length > 0 ? units : [];
  }

  if (!/[\p{L}\p{N}]/u.test(segment)) return [];

  const normalized = normalizeSegment(segment);
  if (keyboardSet.has(normalized)) {
    return [segment];
  }

  const base = stripCombiningMarks(segment);
  const units = splitGraphemes(base).filter((unit) => /[\p{L}\p{N}]/u.test(unit));
  return units.length > 0 ? units : [];
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

export default function WordDropDash() {
  const {
    content,
    loading,
    error,
    currentRound,
    totalRounds,
    score,
    showExitConfirm,
    setShowExitConfirm,
    updateScore,
    nextRound,
    completeGame,
    confirmExit,
    cancelExit,
    startNewGame,
    gameState: { resetRoundState },
    isComplete,
    targetLanguage,
  } = useGameSession({
    gameType: 'word-drop-dash',
    difficulty: 'beginner',
    autoSave: false,
  });

  const [activeWord, setActiveWord] = useState<RoundWord | null>(null);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [roundStatus, setRoundStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timeLeft, setTimeLeft] = useState(0);
  const [dropKey, setDropKey] = useState(0);

  // Cast content to the expected type
  const wordDropContent = content as WordDropDashContent | undefined;
  const rounds = wordDropContent?.rounds || [];
  const currentRoundData = rounds[currentRound];
  const languageMeta = getLearningLanguageMeta(targetLanguage);

  const baseKeyboardPool = useMemo(() => getKeyboardPool(languageMeta.language), [languageMeta.language]);
  const baseKeyboardSet = useMemo(
    () => new Set(baseKeyboardPool.map(normalizeSegment)),
    [baseKeyboardPool]
  );

  const wordText = activeWord?.word?.trim() || '';
  const wordSegments = useMemo(() => splitGraphemes(wordText.normalize('NFC')), [wordText]);
  const segmentUnits = useMemo(
    () => wordSegments.map((segment) => getInputUnits(segment, languageMeta.language, baseKeyboardSet)),
    [baseKeyboardSet, languageMeta.language, wordSegments]
  );
  const inputSequence = useMemo(
    () => segmentUnits.flat().map(normalizeSegment),
    [segmentUnits]
  );
  const segmentRanges = useMemo(() => {
    let cursor = 0;
    return segmentUnits.map((units) => {
      const start = cursor;
      const end = cursor + units.length;
      cursor = end;
      return { start, end };
    });
  }, [segmentUnits]);

  const revealedWord = useMemo(() => {
    return wordSegments
      .map((seg, idx) => {
        const range = segmentRanges[idx];
        if (range.end === range.start) return seg;
        return selectedSegments.length >= range.end ? seg : '_';
      })
      .join(' ');
  }, [segmentRanges, selectedSegments.length, wordSegments]);

  const keyboardChars = useMemo(() => {
    const poolSet = new Set(baseKeyboardPool.map(normalizeSegment));
    const required = new Set(inputSequence);
    const merged = [...baseKeyboardPool];
    required.forEach((segment) => {
      if (!poolSet.has(segment)) {
        merged.push(segment);
      }
    });
    return merged;
  }, [baseKeyboardPool, inputSequence]);
  const isRoundOver = roundStatus !== 'playing';
  const timeLimit = currentRoundData?.timeLimit ?? 0;
  const timePercent = timeLimit > 0 ? Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100)) : 0;

  // Reset round state when round changes
  useEffect(() => {
    resetRoundState();
    if (!currentRoundData || currentRoundData.words.length === 0) {
      setActiveWord(null);
      return;
    }
    const nextWord = currentRoundData.words[Math.floor(Math.random() * currentRoundData.words.length)];
    setActiveWord(nextWord);
    setSelectedSegments([]);
    setRoundStatus('playing');
    setTimeLeft(currentRoundData.timeLimit);
    setDropKey((prev) => prev + 1);
  }, [currentRound, currentRoundData, resetRoundState]);

  useEffect(() => {
    if (!currentRoundData || !activeWord) return;
    setTimeLeft(currentRoundData.timeLimit);
  }, [activeWord, currentRoundData]);

  useEffect(() => {
    if (!currentRoundData || roundStatus !== 'playing') return;

    const endAt = Date.now() + currentRoundData.timeLimit * 1000;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setRoundStatus('lost');
      }
    }, 200);

    return () => clearInterval(interval);
  }, [currentRoundData, dropKey, roundStatus]);

  const handleNext = async () => {
    if (currentRound + 1 >= totalRounds) {
      await completeGame();
    } else {
      nextRound();
    }
  };

  const handleLetter = (letter: string) => {
    if (roundStatus !== 'playing') return;

    const normalized = normalizeSegment(letter);
    const expected = inputSequence[selectedSegments.length];

    if (!expected) return;

    if (normalized === expected) {
      const next = [...selectedSegments, normalized];
      setSelectedSegments(next);
      if (next.length >= inputSequence.length) {
        updateScore(score + 10);
        setRoundStatus('won');
      }
    } else {
      setRoundStatus('lost');
    }
  };

  if (loading) return <GameLoading gameName="Word Drop Dash" />;
  if (error) return <GameError error={error} onRetry={startNewGame} />;
  if (!content) return <GameLoading gameName="Word Drop Dash" />;

  if (isComplete) {
    return (
      <GameLayout title="Word Drop Dash">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">{score}</span></p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link to="/games" className="btn-secondary px-6 py-3 w-full sm:w-auto">
              Back to Games
            </Link>
            <button
              onClick={startNewGame}
              className="btn-primary px-6 py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (!currentRoundData) {
    return <GameLoading gameName="Word Drop Dash" message="Loading round..." />;
  }

  return (
    <>
      <GameLayout title="Word Drop Dash" score={score} progress={`${currentRound + 1}/${totalRounds}`}>
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 mb-8">
            <div className="flex flex-col gap-3 mb-6 text-sm text-gray-600">
              <p>Type the word before it reaches the ground.</p>
              <div className="flex items-center gap-3">
                <span className="text-xl">{activeWord?.emoji}</span>
                <span className="font-semibold text-gray-800">{activeWord?.translation}</span>
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-50 to-indigo-50 rounded-2xl border border-indigo-100 p-6 mb-6">
              <div className="relative h-40 overflow-hidden rounded-xl border border-indigo-100 bg-white">
                <div
                  key={dropKey}
                  className="word-drop-fall font-bold text-2xl md:text-3xl text-indigo-800 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 shadow-sm"
                  style={{
                    animationDuration: `${Math.max(1, timeLimit)}s`,
                    animationPlayState: roundStatus === 'playing' ? 'running' : 'paused',
                  }}
                  lang={languageMeta.bcp47}
                  dir={languageMeta.dir}
                >
                  {activeWord?.word}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Your input</p>
                <div
                  className="text-3xl font-mono tracking-widest text-gray-900"
                  lang={languageMeta.bcp47}
                  dir={languageMeta.dir}
                >
                  {revealedWord}
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-100">
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span>Time Left: {timeLeft}s</span>
                <span>{timeLimit}s total</span>
              </div>
              <div className="w-full bg-indigo-100 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${timePercent}%` }}
                ></div>
              </div>
            </div>

            {roundStatus === 'won' && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                <p className="font-semibold text-green-900">Nice! +10 points</p>
              </div>
            )}

            {roundStatus === 'lost' && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                <p className="font-semibold text-red-900">Too slow or incorrect!</p>
                <p className="text-sm text-red-800" lang={languageMeta.bcp47} dir={languageMeta.dir}>
                  The word was: {activeWord?.word}
                </p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3 font-medium">Keyboard</p>
              <div className="flex flex-wrap gap-2">
                {keyboardChars.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleLetter(letter)}
                    disabled={isRoundOver}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${isRoundOver
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer'
                      }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {isRoundOver && (
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
      </GameLayout >

      <ExitConfirmModal
        isOpen={showExitConfirm}
        onConfirm={confirmExit}
        onCancel={cancelExit}
        title="Finish Game Early?"
        message="If you finish now, this game will end and your current progress will be abandoned. Do you want to finish anyway?"
        cancelText="Keep Playing"
        confirmText="Finish Game"
      />
    </>
  );
}
