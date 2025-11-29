import React, { useState } from 'react';
import { ChevronRight, Check, X } from 'lucide-react';
import GameLayout from '../components/GameLayout';

export default function ContextConnect() {
  const [currentRound, setCurrentRound] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const passages = [
    {
      text: 'The weather is very nice today. The sun is _____ and the sky is blue.',
      blanks: [{ index: 0, correct: 'shining', options: ['raining', 'shining', 'snowing', 'stormy'] }]
    },
    {
      text: 'I love reading books because they help me _____ new vocabulary and improve my _____.',
      blanks: [
        { index: 0, correct: 'learn', options: ['forget', 'learn', 'ignore', 'skip'] },
        { index: 1, correct: 'skills', options: ['money', 'skills', 'looks', 'health'] }
      ]
    },
    {
      text: 'She was very _____ about the exam results. She had studied _____ and was confident about passing.',
      blanks: [
        { index: 0, correct: 'confident', options: ['worried', 'confident', 'confused', 'tired'] },
        { index: 1, correct: 'hard', options: ['lazily', 'softly', 'hard', 'quickly'] }
      ]
    }
  ];

  const currentPassage = passages[currentRound];
  const isComplete = currentRound >= passages.length;
  const allAnswered = answers.length === currentPassage.blanks.length && answers.every(a => a !== null);

  const handleSelectOption = (blankIndex: number, optionIndex: number) => {
    if (feedback === null) {
      const newAnswers = [...answers];
      newAnswers[blankIndex] = optionIndex;
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    let allCorrect = true;
    for (let i = 0; i < currentPassage.blanks.length; i++) {
      const blank = currentPassage.blanks[i];
      const selectedIndex = answers[i];
      if (selectedIndex === null || blank.options[selectedIndex] !== blank.correct) {
        allCorrect = false;
        break;
      }
    }

    setFeedback(allCorrect ? 'correct' : 'incorrect');
    if (allCorrect) {
      setScore(score + 10);
    }
  };

  const handleNext = () => {
    setAnswers([]);
    setFeedback(null);
    setCurrentRound(currentRound + 1);
  };

  if (isComplete) {
    return (
      <GameLayout title="Context Connect">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">{score} / {passages.length * 10}</span></p>
          <button
            onClick={() => {
              setCurrentRound(0);
              setAnswers([]);
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
    <GameLayout title="Context Connect" score={score} progress={`${currentRound + 1}/${passages.length}`}>
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 mb-8">
          <p className="text-sm text-gray-600 mb-8">Fill in the blanks with the most contextually appropriate word:</p>

          <div className="bg-rose-50 rounded-xl p-6 mb-8 border-2 border-rose-200">
            {currentPassage.blanks.map((blank, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                <p className="text-sm text-gray-600 mb-3 font-medium">Blank {idx + 1}:</p>
                <div className="space-y-2 ml-4">
                  {blank.options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(idx, optIdx)}
                      disabled={feedback !== null}
                      className={`block w-full p-3 rounded-lg text-left font-medium transition-all ${
                        answers[idx] === optIdx
                          ? 'bg-rose-300 text-rose-900'
                          : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                      } ${feedback !== null ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
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
                    <p className="font-semibold text-green-900">All correct!</p>
                    <p className="text-sm text-green-800">You earned 10 points!</p>
                  </div>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">Not quite right</p>
                    <p className="text-sm text-red-800">Try reading the passage again and think about context.</p>
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
