import React, { useState } from 'react';
import { ChevronRight, Check, X } from 'lucide-react';
import GameLayout from '../components/GameLayout';

export default function ConjugationCoach() {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const questions = [
    {
      sentence: 'Yesterday, I _____ a book.',
      options: ['read', 'reads', 'reading', 'will read'],
      correctIndex: 0,
      explanation: 'Past tense with "yesterday"'
    },
    {
      sentence: 'She _____ to the store every day.',
      options: ['go', 'goes', 'went', 'going'],
      correctIndex: 1,
      explanation: 'Present tense with "every day"'
    },
    {
      sentence: 'Tomorrow, they _____ the project.',
      options: ['completed', 'complete', 'will complete', 'completing'],
      correctIndex: 2,
      explanation: 'Future tense with "tomorrow"'
    },
    {
      sentence: 'Right now, he _____ a cake.',
      options: ['bakes', 'baked', 'is baking', 'will bake'],
      correctIndex: 2,
      explanation: 'Present continuous with "right now"'
    }
  ];

  const currentQuestion = questions[currentRound];
  const isComplete = currentRound >= questions.length;

  const handleSelectAnswer = (index: number) => {
    if (feedback === null) {
      setSelectedAnswer(index);
      const isCorrect = index === currentQuestion.correctIndex;
      setFeedback(isCorrect ? 'correct' : 'incorrect');

      if (isCorrect) {
        setScore(score + 10);
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    setCurrentRound(currentRound + 1);
  };

  if (isComplete) {
    return (
      <GameLayout title="Conjugation Coach">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">{score} / {questions.length * 10}</span></p>
          <button
            onClick={() => {
              setCurrentRound(0);
              setSelectedAnswer(null);
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
    <GameLayout title="Conjugation Coach" score={score} progress={`${currentRound + 1}/${questions.length}`}>
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 mb-8">
          <p className="text-sm text-gray-600 mb-8">Select the correct verb conjugation:</p>

          <div className="bg-teal-50 rounded-xl p-6 mb-8 border-2 border-teal-200">
            <p className="text-lg text-gray-900 font-medium">{currentQuestion.sentence}</p>
          </div>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={feedback !== null}
                className={`w-full p-4 rounded-lg text-left font-semibold transition-all ${
                  selectedAnswer === index
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
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
              feedback === 'correct'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
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
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
