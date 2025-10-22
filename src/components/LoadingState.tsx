import React from 'react'

const LoadingState: React.FC = () => {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Connecting to Hedera...</p>
    </div>
  )
}

export default LoadingState