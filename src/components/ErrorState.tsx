import React from 'react'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error-state">
      <div className="error-card">
        <h3>Connection Error</h3>
        <p>{message}</p>
        <button onClick={onRetry} className="btn btn-primary">
          Retry
        </button>
      </div>
    </div>
  )
}

export default ErrorState