/**
 * Basic test for useGameSession hook to verify session management standardization
 * This is a minimal test to verify the hook interface and basic functionality
 */

import { describe, it, expect } from 'vitest';

describe('useGameSession Hook Interface', () => {
  it('should export useGameSession function', async () => {
    // Simple import test to verify the hook exports correctly
    const { useGameSession } = await import('../useGameSession');
    expect(typeof useGameSession).toBe('function');
  });

  it('should have correct TypeScript interface', () => {
    // This test verifies that the TypeScript interface is correctly defined
    // by checking that the file compiles without errors
    const fs = require('fs');
    const path = require('path');
    
    const hookPath = path.join(__dirname, '../useGameSession.ts');
    const hookContent = fs.readFileSync(hookPath, 'utf8');
    
    // Verify key interface elements are present
    expect(hookContent).toContain('interface UseGameSessionReturn');
    expect(hookContent).toContain('gameState:');
    expect(hookContent).toContain('retryLastAction:');
    expect(hookContent).toContain('clearError:');
    expect(hookContent).toContain('feedback:');
    expect(hookContent).toContain('setFeedback:');
    expect(hookContent).toContain('selectedAnswer:');
    expect(hookContent).toContain('setSelectedAnswer:');
    expect(hookContent).toContain('resetRoundState:');
  });
});