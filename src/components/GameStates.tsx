import { Loader2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GameLoadingProps {
  gameName?: string;
  message?: string;
}

export function GameLoading({ gameName, message }: GameLoadingProps) {
  const displayMessage = message || (gameName ? `Loading ${gameName}...` : 'Generating your game...');
  
  return (
    <div className="min-h-screen bg-page hero-grid flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-accent flex items-center justify-center shadow-soft">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">{displayMessage}</h2>
        <p className="text-muted">This may take a few seconds...</p>
        <div className="mt-6 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface GameErrorProps {
  error: string;
  onRetry?: () => void;
  showBackButton?: boolean;
}

export function GameError({ error, onRetry, showBackButton = true }: GameErrorProps) {
  const isRateLimited = error.toLowerCase().includes('rate limit');

  return (
    <div className="min-h-screen bg-page hero-grid flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-warning-soft border border-warning flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-warning" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          {isRateLimited ? 'Slow Down!' : 'Oops! Something went wrong'}
        </h2>
        <p className="text-muted mb-6">{error}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showBackButton && (
            <Link
              to="/games"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 btn-secondary rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Games
            </Link>
          )}
          {onRetry && !isRateLimited && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 btn-primary rounded-xl"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
