// services/api/interceptors.ts
import { AxiosInstance } from 'axios';

let openErrorPopup: () => void;
let setErrorText: (message: string) => void;

export function initializeErrorHandling(openPopup: () => void, setErrorMsg: (message: string) => void) {
    openErrorPopup = openPopup;
    setErrorText = setErrorMsg;
}

export function addAuthTokenInterceptor(api: AxiosInstance) {
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem(`authToken`);

            if (token) {
                config.headers[`Authorization`] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            console.error(`Request error: ${error}`);
            return Promise.reject(error);
        }
    );
}

export function handleHTTPError(api: AxiosInstance) {
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response) {
                console.error('Error in the response:', error.response.status, error.response.data);

                let errorMessage = 'An unknown error occurred';

                if (error.response.status === 422 && Array.isArray(error.response.data.detail)) {
                    const validationErrors = error.response.data.detail.map(
                        (error: { msg: string }) => error.msg
                    );
                    errorMessage = validationErrors.join(', ') || 'Validation failed';
                } else {
                    errorMessage = error.response.data?.detail || 'An unknown error occurred';
                }

                setErrorText(errorMessage);
                openErrorPopup();
            } else if (error.request) {
                console.error('No response received:', error.request);
                setErrorText('No response received from the server.');
                openErrorPopup();
            } else {
                console.error('Request error:', error.message);
                setErrorText(`Request error: ${error.message}`);
                openErrorPopup();
            }
            return Promise.reject(error);
        }
    );
}


