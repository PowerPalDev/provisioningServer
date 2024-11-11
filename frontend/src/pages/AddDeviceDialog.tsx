import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface AddDeviceDialogProps {
    open: boolean;
    handleClose: () => void;
}

export const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({ open, handleClose }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Device Name"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    margin="dense"
                    label="Owner"
                    fullWidth
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">Cancel</Button>
                <Button onClick={handleClose} variant="contained" color="primary">Add Device</Button>
            </DialogActions>
        </Dialog>
    );
};
