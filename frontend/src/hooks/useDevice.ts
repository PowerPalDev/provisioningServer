import { useState } from 'react';
import { getDevices, removeDevice } from '../services/DeviceService.service';
import { Device, DeviceClass } from '../models/Device';
import { addUserDevice } from '../services/UserService.service';

export const useDevice = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const fetchDevices = async () => {
        setLoading(true);
        try {
            console.log("Fetching devices...");
            const response = await getDevices();
            console.log("Devices fetched:", response.data);
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
            console.log(`Creating new device: ${newDevice}`)
            const response = await addUserDevice(userId, newDevice);

            if (response && response.data) {
                await fetchDevices();
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
            setDevices((prevDevices) => prevDevices.filter((device) => device.id !== deviceId));
            console.log(`Attempting to delete device with ID ${deviceId}...`);

            await removeDevice(deviceId);
            console.log(`Device with ID ${deviceId} removed successfully.`);
        } catch (e) {
            console.error(`Failed to delete device with ID ${deviceId}:`, e);
            await fetchDevices();
        }
    };


    return { devices, loading, error, handleClosePopUp, fetchDevices, createDevice, deleteDevice };

};
