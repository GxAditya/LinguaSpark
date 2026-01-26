/**
 * Integration test to verify games use standardized session management
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Game Session Management Integration', () => {
  const gamesDir = path.join(__dirname, '..');
  const gameFiles = fs.readdirSync(gamesDir).filter(file => file.endsWith('.tsx'));

  it('should have updated AudioJumble to use standardized session management', () => {
    const audioJumbleContent = fs.readFileSync(path.join(gamesDir, 'AudioJumble.tsx'), 'utf8');
    
    // Verify it uses hook's state instead of local state
    expect(audioJumbleContent).toContain('gameState: { feedback, setFeedback, selectedAnswer, setSelectedAnswer, resetRoundState }');
    expect(audioJumbleContent).toContain('updateScore(score + points)');
    expect(audioJumbleContent).toContain('nextRound()');
    
    // Verify it doesn't manage its own currentRound, score, feedback
    expect(audioJumbleContent).not.toContain('useState(0); // for currentRound');
    expect(audioJumbleContent).not.toContain('setCurrentRound(currentRound + 1)');
    expect(audioJumbleContent).not.toContain('setScore(score + points)');
    
    // Verify it uses the new audio functionality
    expect(audioJumbleContent).toContain('useAudio');
    expect(audioJumbleContent).toContain('playText');
    expect(audioJumbleContent).toContain('audioLoading');
    expect(audioJumbleContent).toContain('preloadTexts');
    
    // Verify it doesn't use old browser TTS directly
    expect(audioJumbleContent).not.toContain('new SpeechSynthesisUtterance');
    expect(audioJumbleContent).not.toContain('window.speechSynthesis.speak');
  });

  it('should have updated ImageInstinct to use standardized session management', () => {
    const imageInstinctContent = fs.readFileSync(path.join(gamesDir, 'ImageInstinct.tsx'), 'utf8');
    
    // Verify it uses hook's state
    expect(imageInstinctContent).toContain('gameState: { feedback, setFeedback, selectedAnswer, setSelectedAnswer, resetRoundState }');
    expect(imageInstinctContent).toContain('updateScore(score + points)');
    expect(imageInstinctContent).toContain('nextRound()');
  });

  it('should have updated WordDropDash to use standardized session management', () => {
    const wordDropDashContent = fs.readFileSync(path.join(gamesDir, 'WordDropDash.tsx'), 'utf8');
    
    // Verify it uses hook's state
    expect(wordDropDashContent).toContain('gameState: { feedback, setFeedback, resetRoundState }');
    expect(wordDropDashContent).toContain('updateScore(score + points)');
    expect(wordDropDashContent).toContain('nextRound()');
    
    // Verify it doesn't manage its own currentRound, score
    expect(wordDropDashContent).not.toContain('setCurrentRound(currentRound + 1)');
    expect(wordDropDashContent).not.toContain('setScore(score + points)');
  });

  it('should have TranslationMatchUp using standardized feedback types', () => {
    const translationMatchUpContent = fs.readFileSync(path.join(gamesDir, 'TranslationMatchUp.tsx'), 'utf8');
    
    // Verify it uses standardized feedback types
    expect(translationMatchUpContent).toContain("setFeedback('correct')");
    expect(translationMatchUpContent).toContain("setFeedback('incorrect')");
    expect(translationMatchUpContent).toContain("feedback === 'correct'");
    
    // Verify it doesn't use old feedback types
    expect(translationMatchUpContent).not.toContain("'match'");
    expect(translationMatchUpContent).not.toContain("'mismatch'");
  });

  it('should verify all games import useGameSession hook', () => {
    gameFiles.forEach(gameFile => {
      const gameContent = fs.readFileSync(path.join(gamesDir, gameFile), 'utf8');
      
      // All games should import useGameSession
      expect(gameContent).toContain("import { useGameSession }");
      
      // All games should call useGameSession
      expect(gameContent).toContain("useGameSession(");
    });
  });
});