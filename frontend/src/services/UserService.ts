
import api from "./api/axiosInstance";
import { environment } from "../enviroment";


export const authenticateUser = async (username: string, password: string) => {
  try {
    const response = await api.post(
      `${environment.user.login}?username=${username}&password=${password}`
    );
    const authToken = response.data.access_token;
    localStorage.setItem("authToken", authToken);

    if(authToken){
      
    }
    return response;
  } catch (error) {
    console.error(`Authentication failed: ${error}`);
  }
};

export const createUser = async (username: string, password: string) => {
  try {
    const response = await api.post(
      environment.user.signup,
      { username, password },
     );
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

export const addUserDevice = async (userId: number) => {
  try {
    const response = await api.post(
      environment.user.addDevice(userId),
    );
    return response;
  } catch (error) {
    console.error(`Failed to create a new device for user ${userId}:`, error);
  }
};
