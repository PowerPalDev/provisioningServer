import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

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
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="delete-dialog-title">
            <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1">{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">
                    Cancel
                </Button>
                <Button onClick={handleDelete} variant="contained" color="primary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};
