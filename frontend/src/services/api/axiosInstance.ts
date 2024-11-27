import axios from 'axios';
import { url } from '../../enviroment';
import { addAuthTokenInterceptor, handleHTTPError } from './interceptors';

const api = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
    },
});

addAuthTokenInterceptor(api);
handleHTTPError(api);

export default api;
