import axios from 'axios';
import { environment, url } from '../enviroment';
import { User } from '../models/User';

const api = axios.create({
  baseURL: url,
});

export const authenticateUser = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await api.post(environment.user.auth, { username, password });
    const { token } = response.data;

    if (token) {
      localStorage.setItem('authToken', token); // Save the token for later use
      return true; // Indicate success
    } else {
      return false; // Indicate failure if no token is returned
    }
  } catch (error) {
    console.error('Authentication failed:', error);
    return false; // Return false on error
  }
};

export const createUser = async (user: User) => {
  try {
    const response = await api.post(environment.user.signup, user);
    return response.data
  } catch (error) {
    console.error('Registration failed: ', error);
    throw new Error('Registration failed, please try again');
  }
}