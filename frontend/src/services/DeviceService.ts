import { environment } from '../enviroment';
import api from './api/axiosInstance';

export const getDevices = async () => {
    try {
        const response = await api.get(
            environment.device.list(),
        );
        return response;
    } catch (e) {
        throw new Error(`Something went wrong while retriving the device list`);
    }
}

export const removeDevice = async (deviceId: number) => {
    try {
        const response = await api.delete(`${environment.device.remove(deviceId)}`);
        return response
    } catch (e) {
        console.error(`Something went wrong while trying to remove device with deviceId: ${e}`);
        throw new Error(`Something went wrong while trying to remove device with deviceId: ${deviceId}`);
    }
}