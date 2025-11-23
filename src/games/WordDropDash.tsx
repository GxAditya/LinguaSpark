import React, { useState, useEffect } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import GameLayout from '../components/GameLayout';

export default function WordDropDash() {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);

  const rounds = [
    {
      words: ['Cat', 'Dog', 'Bird'],
      targets: ['🐱', '🐕', '🐦'],
      timeLimit: 30
    },
    {
      words: ['Red', 'Blue', 'Green'],
      targets: ['🔴', '🔵', '🟢'],
      timeLimit: 25
    }
  ];

  const isComplete = currentRound >= rounds.length;

  if (isComplete) {
    return (
      <GameLayout title="Word Drop Dash">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold text-orange-600">{score}</span></p>
          <button
            onClick={() => {
              setCurrentRound(0);
              setScore(0);
              setRoundComplete(false);
            }}
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      </GameLayout>
    );
  }

  const handleScore = () => {
    setScore(score + 10);
    setRoundComplete(true);
  };

  return (
    <GameLayout title="Word Drop Dash" score={score} progress={`${currentRound + 1}/${rounds.length}`}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-sm text-gray-600 mb-8">Drag falling words to match with the correct target!</p>

          <div className="bg-gradient-to-b from-yellow-50 to-orange-50 rounded-xl p-8 mb-8 min-h-64 flex flex-col items-center justify-center border-4 border-dashed border-yellow-300">
            <p className="text-center text-gray-600 mb-6">
              This is a timed interactive game. In a full implementation, words would fall from the top and you'd drag them to targets.
            </p>
            <div className="flex gap-4">
              {rounds[currentRound].targets.map((target, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl mb-2">{target}</div>
                  <p className="text-sm text-gray-600">{rounds[currentRound].words[idx]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-8 border border-yellow-200">
            <p className="text-sm text-gray-600">Time Limit: {rounds[currentRound].timeLimit}s</p>
            <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
              <div className="bg-yellow-500 h-2 rounded-full w-2/3 animate-pulse"></div>
            </div>
          </div>

          {!roundComplete ? (
            <button
              onClick={handleScore}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Complete Round (Demo)
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentRound(currentRound + 1);
                setRoundComplete(false);
              }}
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
