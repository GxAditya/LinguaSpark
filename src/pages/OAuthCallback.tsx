import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { provider } = useParams<{ provider: 'google' | 'github' }>();
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setStatus('error');
        setError(errorDescription || 'Authentication was cancelled or failed');
        return;
      }

      if (!code) {
        setStatus('error');
        setError('No authorization code received');
        return;
      }

      if (!provider || (provider !== 'google' && provider !== 'github')) {
        setStatus('error');
        setError('Invalid OAuth provider');
        return;
      }

      try {
        await handleOAuthCallback(provider, code);
        setStatus('success');
        // Redirect to dashboard after a brief success message
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } catch (err: unknown) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      }
    };

    processCallback();
  }, [provider, searchParams, handleOAuthCallback, navigate]);

  return (
    <div className="min-h-screen bg-page hero-grid flex items-center justify-center">
      <div className="bg-surface rounded-2xl shadow-float p-8 max-w-md w-full mx-4 text-center border border-default">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-accent animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-primary mb-2">
              Signing you in...
            </h2>
            <p className="text-muted">
              Please wait while we complete your {provider === 'google' ? 'Google' : 'GitHub'} sign in.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-success-soft rounded-full flex items-center justify-center mx-auto mb-6 border border-success">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Welcome to LinguaSpark!
            </h2>
            <p className="text-muted">
              Redirecting you to your dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-warning-soft rounded-full flex items-center justify-center mx-auto mb-6 border border-warning">
              <AlertCircle className="w-10 h-10 text-warning" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Authentication Failed
            </h2>
            <p className="text-muted mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/signin')}
                className="btn-primary px-6 py-2 rounded-xl"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-secondary px-6 py-2 rounded-xl"
              >
                Go Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
