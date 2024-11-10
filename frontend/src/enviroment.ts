let host_url = `http://${process.env.REACT_APP_HOST}`;
const port = `:${process.env.REACT_APP_PORT}`
export const url = host_url + port;

export const environment = {
    production: false,
    user: {
        signup: '/users',
        login: '/login'
    },
};