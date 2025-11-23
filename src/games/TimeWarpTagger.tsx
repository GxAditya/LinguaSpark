import React, { useState } from 'react';
import { ChevronRight, Check, X } from 'lucide-react';
import GameLayout from '../components/GameLayout';

export default function TimeWarpTagger() {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const questions = [
    {
      timeReference: 'Yesterday',
      sentence: 'Yesterday, I _____ a movie with my friends.',
      options: ['watch', 'watched', 'will watch', 'am watching'],
      correctIndex: 1,
      tense: 'Past Simple'
    },
    {
      timeReference: 'Every morning',
      sentence: 'Every morning, she _____ coffee before work.',
      options: ['drinks', 'drunk', 'drank', 'will drink'],
      correctIndex: 0,
      tense: 'Present Simple'
    },
    {
      timeReference: 'Next week',
      sentence: 'Next week, they _____ to Paris for vacation.',
      options: ['go', 'went', 'will go', 'are going'],
      correctIndex: 2,
      tense: 'Future Simple'
    },
    {
      timeReference: 'Right now',
      sentence: 'Right now, he _____ his homework in his room.',
      options: ['does', 'did', 'is doing', 'will do'],
      correctIndex: 2,
      tense: 'Present Continuous'
    },
    {
      timeReference: 'Since last year',
      sentence: 'Since last year, they _____ French classes.',
      options: ['take', 'took', 'have taken', 'will take'],
      correctIndex: 2,
      tense: 'Present Perfect'
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
      <GameLayout title="Time Warp Tagger">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold text-orange-600">{score} / {questions.length * 10}</span></p>
          <button
            onClick={() => {
              setCurrentRound(0);
              setSelectedAnswer(null);
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
    <GameLayout title="Time Warp Tagger" score={score} progress={`${currentRound + 1}/${questions.length}`}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-sm text-gray-600 mb-8">Select the correct verb tense based on the time reference:</p>

          <div className="bg-violet-50 rounded-xl p-6 mb-4 border-2 border-violet-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg">🕐</span>
              <span className="px-4 py-2 bg-violet-200 rounded-full font-semibold text-violet-900">
                {currentQuestion.timeReference}
              </span>
            </div>
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
                    : 'bg-violet-100 border-2 border-violet-300 text-violet-900 hover:bg-violet-200'
                } ${feedback !== null ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {option}
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
                    <p className="text-sm text-green-800">Tense: {currentQuestion.tense}</p>
                  </div>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">Not quite right</p>
                    <p className="text-sm text-red-800">The "{currentQuestion.timeReference}" time reference requires {currentQuestion.tense}</p>
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
