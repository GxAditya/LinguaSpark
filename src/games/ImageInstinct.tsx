import React, { useState } from 'react';
import { ChevronRight, Check, X } from 'lucide-react';
import GameLayout from '../components/GameLayout';

export default function ImageInstinct() {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const rounds = [
    {
      word: 'Apple',
      correctIndex: 0,
      images: ['🍎', '🍌', '🍊', '🍇']
    },
    {
      word: 'Cat',
      correctIndex: 2,
      images: ['🐕', '🐦', '🐱', '🐭']
    },
    {
      word: 'Tree',
      correctIndex: 1,
      images: ['🌺', '🌳', '🌲', '🌻']
    },
    {
      word: 'Sun',
      correctIndex: 3,
      images: ['⭐', '🌙', '☁️', '☀️']
    },
    {
      word: 'Fish',
      correctIndex: 0,
      images: ['🐟', '🦈', '🦑', '🦞']
    }
  ];

  const currentRound_obj = rounds[currentRound];
  const isComplete = currentRound >= rounds.length;

  const handleSelectImage = (index: number) => {
    if (feedback === null) {
      setSelectedImage(index);
      const isCorrect = index === currentRound_obj.correctIndex;
      setFeedback(isCorrect ? 'correct' : 'incorrect');

      if (isCorrect) {
        setScore(score + 10);
      }
    }
  };

  const handleNext = () => {
    setSelectedImage(null);
    setFeedback(null);
    setCurrentRound(currentRound + 1);
  };

  if (isComplete) {
    return (
      <GameLayout title="Image Instinct">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold text-orange-600">{score} / {rounds.length * 10}</span></p>
          <button
            onClick={() => {
              setCurrentRound(0);
              setSelectedImage(null);
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
    <GameLayout title="Image Instinct" score={score} progress={`${currentRound + 1}/${rounds.length}`}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-sm text-gray-600 mb-8">Tap the image that matches the word:</p>

          <div className="mb-12">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">{currentRound_obj.word}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {currentRound_obj.images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleSelectImage(index)}
                disabled={feedback !== null}
                className={`aspect-square rounded-2xl text-6xl flex items-center justify-center transition-all ${
                  selectedImage === index
                    ? feedback === 'correct'
                      ? 'bg-green-100 scale-110 ring-4 ring-green-500'
                      : 'bg-red-100 scale-105 ring-4 ring-red-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                } ${feedback !== null ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}
              >
                {image}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`p-4 rounded-lg mb-6 flex items-start gap-3 ${
              feedback === 'correct'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
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
                    <p className="text-sm text-red-800">The correct image is: {currentRound_obj.images[currentRound_obj.correctIndex]}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {feedback && (
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
