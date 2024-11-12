import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface RequestFailedProps {
  open: boolean;
  onClose: () => void;
  errorText: string;
}

const RequestFailedPopUp: React.FC<RequestFailedProps> = ({ open, onClose, errorText }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Oops! Something went wrong</DialogTitle>
      <DialogContent>
        <Typography>{errorText}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestFailedPopUp;
