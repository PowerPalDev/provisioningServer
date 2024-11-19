import { useState } from 'react';
import { getDevices, removeDevice } from '../services/DeviceService';
import { Device, DeviceClass } from '../models/Device';
import { addUserDevice } from '../services/UserService';

export const useDevice = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const fetchDevices = async () => {
        try {
            const response = await getDevices();
            setDevices(response.data as Device[]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleClosePopUp = () => {
        console.log('PopUp closed');
        setError('');
    };

    const createDevice = async (newDevice: DeviceClass, userId: number, handleClose: () => void) => {
        try {
            const response = await addUserDevice(userId, newDevice);

            if (response && response.data) {
                fetchDevices();
            } else {
                console.error("Failed to retrieve created device from response");
            }
        } catch (e) {
            console.error(e);
        } finally {
            handleClose();
        }
    };


    const deleteDevice = async (deviceId: number) => {
        try {
            await removeDevice(deviceId);
            setDevices((prevDevices) => prevDevices.filter((device) => device.id !== deviceId));
            console.log(`Device with ID ${deviceId} removed successfully.`);
        } catch (e) {
            console.error(`Failed to delete device with ID ${deviceId}:`, e);
        }
    };

    return { devices, loading, error, handleClosePopUp, fetchDevices, createDevice, deleteDevice };

};
