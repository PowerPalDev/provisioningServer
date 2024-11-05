import axios from 'axios';
import { environment, url } from '../enviroment';
import { User } from '../models/User';

const api = axios.create({
  baseURL: url,
});

export const authenticateUser = async (username: string, password: string) => {
  try {
    const response = await api.post(environment.user.auth, { username, password });
    // const { token } = response.data;
    // localStorage.setItem('authToken', token); //TODO: impement token authentication
    return response.data;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw new Error('Authentication failed. Please try again.');
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