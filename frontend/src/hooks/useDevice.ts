import { useState } from 'react';
import { getDevices } from '../services/DeviceService';
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
        try{
            await addUserDevice(userId, newDevice);
            console.log(`Device: ${newDevice}, created`);
        }catch(e){
            console.error(e);
        }
        handleClose();
    }
    return { devices, loading, error, handleClosePopUp, fetchDevices, createDevice };

};
