import React from 'react';

interface DeleteConfirmationDialogProps {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  title?: string;
  message?: string;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  handleClose,
  handleDelete,
  title = "Delete Device",
  message = "Are you sure you want to delete the device? This action cannot be undone.",
}) => {
  if (!open) return null;

  return (
    <div
      className="modal fade show"
      tabIndex={-1}
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      role="dialog"
      aria-labelledby="delete-dialog-title"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="delete-dialog-title">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {handleDelete(), handleClose()}}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
