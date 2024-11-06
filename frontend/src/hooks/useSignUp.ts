import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/UserService';
import { User } from '../models/User'

export const useSignUpForm = () => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateInputs = (name: string, email: string, password: string) => {

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

        if (!name || name.length < 1) {
            setNameError(true);
            setNameErrorMessage('Name is required.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        return isValid
    };
    const handleSignUp = async (name: string, email: string, password: string) => {
        if (!validateInputs(name, email, password)) return;
        const user: User = {
            name: name,
            email: email,
            password: password
        };
        const response = await createUser(user);
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
        nameError,
        nameErrorMessage,
        passwordError,
        passwordErrorMessage,
        showPassword,
        setShowPassword,
        handleSignUp,
        validateInputs,
    };
};
