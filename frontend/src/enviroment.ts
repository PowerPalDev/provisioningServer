let host_url = `http://${import.meta.env.VITE_HOST}`;
const port = `:${import.meta.env.VITE_PORT}`
export const url = host_url + port;

export const environment = {
    production: false,
    base: '/v1/admin',
    admin: {
        login: (): string =>  `${environment.base}/login`,
        users: (): string => `${environment.base}/users`,
        addDevice: (userId: number): string => `${environment.admin.users}/${userId}/devices/`
    },
    device: {
        list: (): string => `${environment.base}`,
        remove: (deviceId: number): string => `${environment.base}/${deviceId}`
    }
};