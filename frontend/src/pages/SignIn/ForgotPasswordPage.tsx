import React, { useEffect, useState } from 'react';

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPassword({ open, onClose }: ForgotPasswordProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleClose();
  };

  return (
    <div
      className={`modal fade ${isOpen ? 'show' : ''}`}
      tabIndex={-1}
      style={{ display: isOpen ? 'block' : 'none' }}
      aria-labelledby="forgotPasswordModal"
      aria-hidden={!isOpen}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="forgotPasswordModal">
                Reset password
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Enter your account&apos;s email address, and we&apos;ll send you a link to
                reset your password.
              </p>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email address"
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        style={{ display: isOpen ? 'block' : 'none' }}
      ></div>
    </div>
  );
}
