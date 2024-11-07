import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/UserService';

export const useSignUpForm = () => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateInputs = (email: string, password: string) => {

        let isValid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password || password.length < 6) {
            setPasswordError(true);
            // TODO: What we want our password to be?
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid
    };
    const handleSignUp = async (email: string, password: string) => {
        if (!validateInputs(email, password)) return;
 
        const response = await createUser(email, password);
        if (response.status < 500 && response.status > 399)
            //TODO: popup error
            return;
        else if (response.status < 300 && response.status > 199) {
            navigate('/signin');
        }
    };
    return {
        emailError,
        emailErrorMessage,
        passwordError,
        passwordErrorMessage,
        showPassword,
        setShowPassword,
        handleSignUp,
        validateInputs,
    };
};
