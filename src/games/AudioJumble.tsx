import React, { useState } from 'react';
import { ChevronRight, Volume2, Check, X } from 'lucide-react';
import GameLayout from '../components/GameLayout';

export default function AudioJumble() {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const sentences = [
    {
      id: 1,
      text: 'The cat sits on the mat',
      words: ['The', 'cat', 'sits', 'on', 'the', 'mat'],
      correctOrder: [0, 1, 2, 3, 4, 5]
    },
    {
      id: 2,
      text: 'I enjoy reading books every day',
      words: ['I', 'enjoy', 'reading', 'books', 'every', 'day'],
      correctOrder: [0, 1, 2, 3, 4, 5]
    },
    {
      id: 3,
      text: 'She walks to school in the morning',
      words: ['She', 'walks', 'to', 'school', 'in', 'the', 'morning'],
      correctOrder: [0, 1, 2, 3, 4, 5, 6]
    }
  ];

  const currentSentence = sentences[currentRound];
  const [shuffledIndices] = useState(() => {
    const indices = Array.from({ length: currentSentence.words.length }, (_, i) => i);
    return indices.sort(() => Math.random() - 0.5);
  });

  const isComplete = currentRound >= sentences.length;

  const handlePlayWord = (index: number) => {
    const utterance = new SpeechSynthesisUtterance(currentSentence.words[index]);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleWord = (index: number) => {
    if (selectedOrder.includes(index)) {
      setSelectedOrder(selectedOrder.filter(i => i !== index));
    } else {
      setSelectedOrder([...selectedOrder, index]);
    }
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(currentSentence.correctOrder);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(score + 10);
    }
  };

  const handleNext = () => {
    setSelectedOrder([]);
    setFeedback(null);
    setCurrentRound(currentRound + 1);
  };

  if (isComplete) {
    return (
      <GameLayout title="Audio Jumble">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">{score} / {sentences.length * 10}</span></p>
          <button
            onClick={() => {
              setCurrentRound(0);
              setSelectedOrder([]);
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
    <GameLayout title="Audio Jumble" score={score} progress={`${currentRound + 1}/${sentences.length}`}>
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 mb-8">
          <p className="text-sm text-gray-600 mb-6">Arrange the words in the correct order. Click each word to hear it.</p>

          <div className="mb-8 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">Correct sentence:</p>
            <p className="text-lg font-semibold text-gray-900">{currentSentence.text}</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Click words to arrange them:</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {shuffledIndices.map((wordIndex) => (
                <button
                  key={wordIndex}
                  onClick={() => handleToggleWord(wordIndex)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handlePlayWord(wordIndex);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedOrder.includes(wordIndex)
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {currentSentence.words[wordIndex]} <span className="text-xs ml-1 opacity-75">(tap audio)</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">Right-click a word to hear it</p>
          </div>

          {selectedOrder.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2 font-medium">Your order:</p>
              <p className="text-lg text-gray-900">{selectedOrder.map(i => currentSentence.words[i]).join(' ')}</p>
            </div>
          )}

          {feedback && (
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
              feedback === 'correct'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {feedback === 'correct' ? (
                <>
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Perfect!</p>
                    <p className="text-sm text-green-800">You earned 10 points!</p>
                  </div>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">Not quite right</p>
                    <p className="text-sm text-red-800">Try arranging the words in the correct grammatical order.</p>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {!feedback ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOrder.length !== currentSentence.words.length}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
