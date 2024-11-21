import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, TextField } from '@mui/material';
import { useDevice } from '../../hooks/useDevice';
import { DeviceClass } from '../../models/Device';

interface AddDeviceDialogProps {
    open: boolean;
    handleClose: () => void;
}

export const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({ open, handleClose }) => {
    const { createDevice, fetchDevices } = useDevice();
    const [deviceId, setDeviceId] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [deviceMac, setDeviceMac] = useState('');
    const [ownerId, setOwnerId] = useState('');

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newDevice = new DeviceClass(
            parseInt(deviceId, 10),
            deviceMac,
            deviceName,
            parseInt(ownerId, 10)
        );

        console.log(`Device form submitted for device with id: ${newDevice.serial_number}`);

        createDevice(newDevice, parseInt(ownerId, 10), () => {
            fetchDevices();
            handleClose();
        });
    };

    return (
        <Dialog open={open}>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogContent>
                <FormControl component="form" onSubmit={handleFormSubmit}>
                    <FormLabel htmlFor="deviceId">Device ID</FormLabel>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="deviceId"
                        name="deviceId"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                    <FormLabel htmlFor="deviceName">Device Name</FormLabel>
                    <TextField
                        margin="dense"
                        id="deviceName"
                        name="deviceName"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                    <FormLabel htmlFor="deviceMac">Device Mac Address</FormLabel>
                    <TextField
                        margin="dense"
                        id="deviceMac"
                        name="deviceMac"
                        value={deviceMac}
                        onChange={(e) => setDeviceMac(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                    <FormLabel htmlFor="ownerId">Owner ID</FormLabel>
                    <TextField
                        margin="dense"
                        id="ownerId"
                        name="ownerId"
                        label="Owner"
                        value={ownerId}
                        onChange={(e) => setOwnerId(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                    <DialogActions>
                        <Button onClick={handleClose} color="error">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Add device</Button>
                    </DialogActions>
                </FormControl>
            </DialogContent>
        </Dialog>
    );
};
