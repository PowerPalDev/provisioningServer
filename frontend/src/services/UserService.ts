import axios from 'axios';
import { environment, url } from '../enviroment';

const api = axios.create({
  baseURL: url,
});

export const authenticateUser = async (username: string, password: string) => {
  const response = await api.post(environment.user.login, { username, password });
  const { token } = response.data;

  if (token) {
    localStorage.setItem('authToken', token);
  }
  return response;

};

export const createUser = async (username: string, password: string) => {
  try {
    const response = await api.post(environment.user.signup, { username, password });
    return response
  } catch (error) {
    console.error('Registration failed: ', error);
    throw new Error('Registration failed, please try again');
  }
}