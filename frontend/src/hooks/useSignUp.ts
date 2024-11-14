import { useState } from 'react';
import { createUser } from '../services/UserService';

export const useSignUpForm = () => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [signupFailed, setSignupFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

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

    const handleSignUp = async (email: string, password: string, handleClose: () => void) => {
        console.log("Test")
        if (!validateInputs(email, password)){ 
            console.error(`Input given aren't valid`);
            return;}

        try {
            const response = await createUser(email, password);
            
            if (response && response.status < 500 && response.status > 399) {
                setSignupFailed(true);
                setErrorMessage('Something wrong with your request');
                return;
            }
            handleClose()
        } catch (e) {
            setSignupFailed(true);
            setErrorMessage('Something wrong with your request');
            console.log(e);
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
        signupFailed,
        setSignupFailed,
        errorMessage
    };
};
