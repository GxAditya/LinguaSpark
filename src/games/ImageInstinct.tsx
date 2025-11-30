import { useState, useEffect } from 'react';
import { ChevronRight, Check, X, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import ExitConfirmModal from '../components/ExitConfirmModal';
import { GameLoading, GameError } from '../components/GameStates';
import { useGameSession } from '../hooks/useGameSession';

interface ImageRound {
  word: string;
  translation: string;
  correctImage: string;
  options: string[];
  isImageUrl?: boolean;
  fallbackEmojis?: string[];
}

// Component for displaying either an image or emoji with fallback support
function ImageOption({ 
  src, 
  fallbackEmoji, 
  isImageUrl, 
  alt 
}: { 
  src: string; 
  fallbackEmoji?: string; 
  isImageUrl?: boolean; 
  alt: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(isImageUrl);

  // Reset states when src changes
  useEffect(() => {
    if (isImageUrl) {
      setImageError(false);
      setImageLoading(true);
    }
  }, [src, isImageUrl]);

  // If it's not an image URL or if image failed to load, show emoji
  if (!isImageUrl || imageError) {
    return <span className="text-6xl">{fallbackEmoji || src}</span>;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`max-w-full max-h-full object-contain rounded-lg transition-opacity ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />
    </div>
  );
}

export default function ImageInstinct() {
  const {
    session,
    content,
    loading,
    error,
    showExitConfirm,
    setShowExitConfirm,
    confirmExit,
    completeGame,
    startNewGame,
    submitAnswer,
  } = useGameSession('image-instinct');

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rounds: ImageRound[] = (content as any)?.rounds || [];
  const totalRounds = rounds.length;
  const isComplete = currentRound >= totalRounds && totalRounds > 0;

  // Reset local state when round changes
  useEffect(() => {
    setSelectedImage(null);
    setFeedback(null);
  }, [currentRound]);

  if (loading) {
    return <GameLoading gameName="Image Instinct" />;
  }

  if (error) {
    return <GameError error={error} onRetry={startNewGame} />;
  }

  if (!session || !content) {
    return <GameLoading gameName="Image Instinct" />;
  }

  const currentRoundData = rounds[currentRound];
  const correctIndex = currentRoundData?.options?.indexOf(currentRoundData?.correctImage) ?? -1;

  const handleSelectImage = async (index: number) => {
    if (feedback === null && currentRoundData) {
      setSelectedImage(index);
      const isCorrect = currentRoundData.options[index] === currentRoundData.correctImage;
      setFeedback(isCorrect ? 'correct' : 'incorrect');

      const points = isCorrect ? 10 : 0;
      if (isCorrect) {
        setScore(score + points);
      }

      await submitAnswer({
        roundIndex: currentRound,
        selectedImage: index,
        correct: isCorrect,
        points,
      });
    }
  };

  const handleNext = async () => {
    if (currentRound + 1 >= totalRounds) {
      await completeGame();
    }
    setCurrentRound(currentRound + 1);
  };

  if (isComplete) {
    return (
      <GameLayout title="Image Instinct">
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
            <Link to="/games" className="btn-secondary">
              Back to Games
            </Link>
            <button onClick={startNewGame} className="btn-primary flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        </div>
      </GameLayout>
    );
  }

  if (!currentRoundData) {
    return <GameLoading message="Loading round..." />;
  }

  return (
    <>
      <GameLayout
        title="Image Instinct"
        score={score}
        progress={`${currentRound + 1}/${totalRounds}`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 mb-8">
            <p className="text-sm text-gray-600 mb-8">Tap the image that matches the word:</p>

            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{currentRoundData.word}</h2>
              {currentRoundData.translation && (
                <p className="text-lg text-gray-500">({currentRoundData.translation})</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {currentRoundData.options.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectImage(index)}
                  disabled={feedback !== null}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all p-2 ${selectedImage === index
                    ? feedback === 'correct'
                      ? 'bg-green-100 scale-110 ring-4 ring-green-500'
                      : 'bg-red-100 scale-105 ring-4 ring-red-500'
                    : index === correctIndex && feedback === 'incorrect'
                      ? 'bg-green-100 ring-4 ring-green-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                    } ${feedback !== null ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}
                >
                  <ImageOption
                    src={image}
                    fallbackEmoji={currentRoundData.fallbackEmojis?.[index]}
                    isImageUrl={currentRoundData.isImageUrl}
                    alt={`Option ${index + 1}`}
                  />
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
                      <p className="text-sm text-green-800">You earned 10 points!</p>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900">Not quite right</p>
                      <p className="text-sm text-red-800 flex items-center gap-2">
                        The correct answer was: 
                        {currentRoundData.isImageUrl && currentRoundData.fallbackEmojis ? (
                          <span className="text-xl">{currentRoundData.fallbackEmojis[correctIndex]}</span>
                        ) : (
                          <span className="text-xl">{currentRoundData.correctImage}</span>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {feedback && (
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
