import React from 'react';
import { ErrorScreen } from './ErrorScreen';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          title="Oops, something went wrong"
          message="It's not your mistake though. We're working on fixing it!"
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}


