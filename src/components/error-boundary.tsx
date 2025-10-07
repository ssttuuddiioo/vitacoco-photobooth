// Error boundary component for graceful error handling
import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Reload the page to reset app state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-orange-500 text-white p-8">
          <div className="max-w-2xl text-center space-y-8 animate-fade-in">
            <div className="text-9xl mb-4">⚠️</div>
            
            <h1 className="text-5xl font-bold mb-4">
              Oops! Something Went Wrong
            </h1>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="text-2xl mb-4">
                Don't worry, we can fix this!
              </p>
              
              {this.state.error && (
                <details className="text-left mt-4">
                  <summary className="cursor-pointer text-white/80 text-sm mb-2">
                    Technical details (for debugging)
                  </summary>
                  <div className="bg-black/30 rounded-lg p-4 text-xs font-mono overflow-auto max-h-40">
                    <p className="text-red-300 mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-gray-300 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </div>

            <div className="space-y-4">
              <Button
                variant="primary"
                size="large"
                onClick={this.handleReset}
                className="shadow-2xl"
              >
                🔄 Restart Photo Booth
              </Button>

              <p className="text-white/80 text-lg">
                This will reload the app and start fresh
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

