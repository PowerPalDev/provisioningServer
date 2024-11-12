let host_url = `http://${import.meta.env.VITE_HOST}`;
const port = `:${import.meta.env.VITE_PORT}`
export const url = host_url + port;

export const environment = {
    production: false,
    user: {
        signup: '/users',
        login: '/login'
    },
};