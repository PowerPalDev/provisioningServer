let host_url = `http://${import.meta.env.VITE_HOST}`;
const port = `:${import.meta.env.VITE_PORT}`
export const url = host_url + port;

export const environment = {
    production: false,
    user: {
        base: '/users',
        login: '/login',
        addDevice: (userId: number): string => `/users/${userId}/devices/`
    },
    device: {
        base: '/devices',
        list: (): string => `${environment.device.base}`,
        remove: (deviceId: number): string => `${environment.device.base}/${deviceId}`
    }
};