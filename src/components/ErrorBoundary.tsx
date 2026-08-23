import React from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: '2rem', textAlign: 'center', color: 'var(--text-main)', background: 'var(--bg-main)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent-red)' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>System Error Encountered</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
            We've encountered an unexpected issue while processing your request. Our team has been notified.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '0.75rem 1.5rem', background: 'var(--cyan)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            RELOAD INTERFACE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
