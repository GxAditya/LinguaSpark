import { useState, useMemo, useEffect } from 'react';
import { Check, X, ChevronRight, Volume2, Loader2 } from 'lucide-react';
import GameLayout from '../components/GameLayout';
import { useGameSession } from '../hooks/useGameSession';
import { useAudio } from '../hooks/useAudio';
import { GameLoading, GameError } from '../components/GameStates';
import ExitConfirmModal from '../components/ExitConfirmModal';

interface AudioJumbleRound {
  sentence: string;
  words: string[];
  correctOrder: number[];
}

interface AudioJumbleContent {
  rounds: AudioJumbleRound[];
}

export default function AudioJumble() {
  const {
    session,
    loading,
    error,
    content,
    currentRound,
    totalRounds,
    score,
    showExitConfirm,
    submitAnswer,
    updateScore,
    nextRound,
    completeGame,
    confirmExit,
    cancelExit,
    startNewGame,
    gameState: { feedback, setFeedback, selectedAnswer, setSelectedAnswer, resetRoundState },
    isComplete,
  } = useGameSession('audio-jumble');

  // Audio functionality
  const {
    playText,
    stopAudio,
    isLoading: audioLoading,
    isPlaying: audioPlaying,
    error: audioError,
    currentText: currentAudioText,
    clearError: clearAudioError,
    preloadTexts
  } = useAudio();

  // Cast content to the expected type
  const audioContent = content as AudioJumbleContent | undefined;
  const rounds = audioContent?.rounds || [];
  const currentSentence = rounds[currentRound];

  const shuffledIndices = useMemo(() => {
    if (!currentSentence) return [];
    const indices = Array.from({ length: currentSentence.words.length }, (_, i) => i);
    return indices.sort(() => Math.random() - 0.5);
  }, [currentSentence]);

  // Use selectedAnswer from hook state as selectedOrder
  const selectedOrder = (selectedAnswer as number[]) || [];
  const setSelectedOrder = (order: number[]) => setSelectedAnswer(order);

  // Reset selected order when round changes
  useEffect(() => {
    resetRoundState();
    setSelectedOrder([]);
    
    // Preload audio for current sentence words
    if (currentSentence?.words) {
      preloadTexts(currentSentence.words).catch(console.warn);
    }
  }, [currentRound, resetRoundState, currentSentence, preloadTexts]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  if (loading) return <GameLoading gameName="Audio Jumble" />;
  if (error) return <GameError error={error} onRetry={startNewGame} />;
  if (!session || !content) return <GameLoading gameName="Audio Jumble" />;

  const handlePlayWord = async (index: number) => {
    if (!currentSentence) return;
    const word = currentSentence.words[index];
    try {
      clearAudioError();
      await playText(word, 'alloy', {
        volume: 0.8,
        playbackRate: 0.8
      });
    } catch (error) {
      console.error('Failed to play word audio:', error);
    }
  };

  const handleToggleWord = (index: number) => {
    if (selectedOrder.includes(index)) {
      setSelectedOrder(selectedOrder.filter(i => i !== index));
    } else {
      setSelectedOrder([...selectedOrder, index]);
    }
  };

  const handleSubmit = async () => {
    if (!currentSentence) return;
    const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(currentSentence.correctOrder);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    const points = isCorrect ? 10 : 0;
    if (isCorrect) {
      updateScore(score + points);
    }

    await submitAnswer({
      roundIndex: currentRound,
      selectedOrder,
      correct: isCorrect,
      points
    });
  };

  const handleNext = async () => {
    if (currentRound + 1 >= totalRounds) {
      await completeGame();
    } else {
      nextRound();
    }
  };

  if (isComplete) {
    return (
      <GameLayout title="Audio Jumble">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="icon-container-lg mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-xl text-gray-600 mb-2">Final Score: <span className="font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">{score} / {totalRounds * 10}</span></p>
          <button
            onClick={startNewGame}
            className="btn-primary px-6 py-3"
          >
            Play Again
          </button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Audio Jumble" score={score} progress={`${currentRound + 1}/${totalRounds}`}>
      <ExitConfirmModal
        isOpen={showExitConfirm}
        onConfirm={confirmExit}
        onCancel={cancelExit}
      />
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 mb-8">
          <p className="text-sm text-gray-600 mb-6">Arrange the words in the correct order. Click each word to hear it.</p>

            <div className="mb-8 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-3 font-medium">Correct sentence:</p>
              <p className="text-lg font-semibold text-gray-900">{currentSentence.sentence}</p>
            </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Click words to arrange them:</label>
            
            {/* Audio error display */}
            {audioError && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Audio issue: {audioError}
                  <button 
                    onClick={clearAudioError}
                    className="ml-2 text-yellow-600 hover:text-yellow-800 underline"
                  >
                    Dismiss
                  </button>
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {shuffledIndices.map((wordIndex) => {
                const word = currentSentence.words[wordIndex];
                const isCurrentlyPlaying = audioPlaying && currentAudioText === word;
                const isLoadingThisWord = audioLoading && currentAudioText === word;
                
                return (
                  <div key={wordIndex} className="relative">
                    <button
                      onClick={() => handleToggleWord(wordIndex)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedOrder.includes(wordIndex)
                        ? 'bg-purple-500 text-white'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                    >
                      {word}
                    </button>
                    
                    {/* Audio control button */}
                    <button
                      onClick={() => handlePlayWord(wordIndex)}
                      disabled={audioLoading}
                      className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                        isCurrentlyPlaying 
                          ? 'bg-green-500 text-white' 
                          : isLoadingThisWord
                          ? 'bg-yellow-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      } ${audioLoading && currentAudioText !== word ? 'opacity-50' : ''}`}
                      title={isLoadingThisWord ? 'Loading audio...' : isCurrentlyPlaying ? 'Playing...' : 'Play audio'}
                    >
                      {isLoadingThisWord ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : isCurrentlyPlaying ? (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500">Click the audio button (🔊) on each word to hear it</p>
          </div>

          {selectedOrder.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2 font-medium">Your order:</p>
              <p className="text-lg text-gray-900">{selectedOrder.map(i => currentSentence.words[i]).join(' ')}</p>
            </div>
          )}

          {feedback && (
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${feedback === 'correct'
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
                className="btn-primary px-6 py-3 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary px-6 py-3 flex-1 flex items-center justify-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </GameLayout >
  );
}
