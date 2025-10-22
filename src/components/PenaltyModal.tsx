import React from 'react'

interface PenaltyModalProps {
  isOpen: boolean
  amount: number
  penalty: number
  onConfirm: () => void
  onCancel: () => void
}

const PenaltyModal: React.FC<PenaltyModalProps> = ({
  isOpen,
  amount,
  penalty,
  onConfirm,
  onCancel
}) => {
  const formatHbar = (tinybars: number) => {
    return (tinybars / 100000000).toFixed(8) + ' HBAR'
  }

  const netAmount = amount - penalty

  if (!isOpen) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Early Withdrawal Warning</h3>
          <button className="modal-close" onClick={onCancel}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p className="warning-text">⚠️ You are withdrawing before the specified date!</p>
          <div className="penalty-info">
            <p><strong>Original Amount:</strong> {formatHbar(amount)}</p>
            <p><strong>Penalty (0.05%):</strong> {formatHbar(penalty)}</p>
            <p><strong>You will receive:</strong> {formatHbar(netAmount)}</p>
          </div>
          <div className="modal-actions">
            <button onClick={onConfirm} className="btn btn-danger">
              Confirm Withdrawal
            </button>
            <button onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PenaltyModal