import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { authenticateUser } from '../services/UserService';

export const useSignInForm = () => {
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
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (email: string, password: string) => {
    if (!validateInputs(email, password)) return;

    try {
        //TODO: Handle authentication
    //   const isAuthenticated = await authenticateUser(email, password);
      if (true) {
        navigate('/');
      } else {
        setEmailError(true);
        setEmailErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Authentication failed', error);
    }
  };

  return {
    emailError,
    emailErrorMessage,
    passwordError,
    passwordErrorMessage,
    showPassword,
    setShowPassword,
    handleSubmit,
    validateInputs,
  };
};
