import React, { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[EduIQ Error Boundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-ink-50 flex items-center justify-center p-6">
          <div className="bg-white border border-ink-150 rounded-2xl shadow-card p-10 max-w-md w-full text-center">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl bg-cobalt-500 flex items-center justify-center mx-auto mb-6">
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3ZM19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
              </svg>
            </div>

            {/* Message */}
            <h1 className="font-display font-bold text-xl text-ink-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-ink-500 leading-relaxed mb-2">
              EduIQ couldn't load this section. This is usually a temporary issue.
            </p>

            {/* Error Detail (development only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-4 mb-6 bg-rose-50 border border-rose-100 rounded-xl p-4 text-left">
                <p className="text-xs font-mono text-rose-600 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Retry */}
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 active:scale-[0.98] text-sm px-5 py-3 bg-ink-900 text-white hover:bg-ink-800 shadow-card w-full mt-4"
            >
              Try again
            </button>

            {/* Fallback nav */}
            <button
              onClick={() => window.location.assign('/')}
              className="mt-3 text-sm text-ink-500 hover:text-ink-800 transition-colors"
            >
              Go to homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
