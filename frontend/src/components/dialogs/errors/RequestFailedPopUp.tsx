import React from 'react';

interface RequestFailedProps {
  open: boolean;
  onClose: () => void;
  errorText: string;
}

const RequestFailedPopUp: React.FC<RequestFailedProps> = ({ open, onClose, errorText }) => {
  if (!open) return null;

  return (
    <div
      className="modal fade show"
      tabIndex={-1}
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Request Failed</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>{errorText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestFailedPopUp;
