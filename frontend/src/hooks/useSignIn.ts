import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../services/UserService';

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

  const handleSignIn = async (email: string, password: string) => {

    if (!validateInputs(email, password)) return;
    try {
      await authenticateUser(email, password)
      navigate('/');
    } catch (e) {
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
    handleSignIn,
    validateInputs,
  };
};
