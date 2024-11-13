import axios from 'axios';
import { environment, url } from '../enviroment';

const api = axios.create({
    baseURL: url,
});

export const getDevices = async () => {
    try {
        const response = await api.get(
            `${environment.device.list}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            }
        );

        return response;
    } catch (e) {
        console.error(`Something went wrong while retriving the device list: ${e}`);
        throw new Error(`Something went wrong while retriving the device list`);
    }
}

export const removeDevice = async (deviceId: number) => {
    try {
        const response = await api.delete(`${environment.device.remove(deviceId)}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            })
        return response

    } catch (e) {
        console.error(`Something went wrong while trying to remove device with deviceId: ${e}`);
        throw new Error(`Something went wrong while trying to remove device with deviceId: ${deviceId}`);
    }
}