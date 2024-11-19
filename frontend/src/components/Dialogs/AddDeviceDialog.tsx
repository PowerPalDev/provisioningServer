import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, TextField } from '@mui/material';
import { useDevice } from '../../hooks/useDevice';
import { DeviceClass } from '../../models/Device';

interface AddDeviceDialogProps {
    open: boolean;
    handleClose: () => void;
}

export const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({ open, handleClose }) => {
    const { createDevice, fetchDevices } = useDevice();

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const data = new FormData(e.currentTarget);
        const ownerId = parseInt(data.get('ownerId') as string, 10);
        const newDevice = new DeviceClass(parseInt(data.get('deviceId') as string, 10), data.get('deviceAddress') as string, data.get('deviceName') as string,  ownerId)

        console.log(`Device form submitted for device with id: ${newDevice.serial_number}`)
        e.preventDefault();

        createDevice(newDevice, ownerId, handleClose);
        fetchDevices()
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogContent>
                <FormControl component="form" onSubmit={handleFormSubmit}>
                    <FormLabel htmlFor="deviceId">Device ID</FormLabel>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="deviceId"
                        name='deviceId'
                        fullWidth
                        variant="outlined"
                    />
                    <FormLabel htmlFor="deviceName">Device Name</FormLabel>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="deviceName"
                        name='deviceName'
                        fullWidth
                        variant="outlined"
                    />
                    <FormLabel htmlFor="deviceMac">Device Mac Address</FormLabel>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="deviceMac"
                        name='deviceMac'
                        fullWidth
                        variant="outlined"
                    />
                    <FormLabel htmlFor="ownerId">Owner ID</FormLabel>
                    <TextField
                        margin="dense"
                        id="ownerId"
                        name="ownerId"
                        label="Owner"
                        fullWidth
                        variant="outlined"
                    />
                    <DialogActions>
                        <Button onClick={handleClose} color="error">Cancel</Button>
                        <Button type='submit' variant="contained" color="primary">Add device</Button>
                    </DialogActions>
                </FormControl>
            </DialogContent>
        </Dialog>
    );
};
