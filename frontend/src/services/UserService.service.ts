import api from "./api/axiosInstance";
import { environment } from "../enviroment";
import { DeviceClass } from "../models/Device";


export const authenticateAdmin = async (username: string, password: string) => {
  try {
    const response = await api.post(
      `${environment.admin.login()}?username=${username}&password=${password}`
    );
    const authToken = response.data.access_token;
    localStorage.setItem("authToken", authToken);

    if (authToken) {

    }
    return response;
  } catch (error) {
    console.error(`Authentication failed: ${error}`);
  }
};

export const createUser = async (username: string, password: string) => {
  try {
    const response = await api.post(
      environment.admin.users(),
      { username, password },
    );
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

export const addUserDevice = async (userId: number, newDevice: DeviceClass) => {
  try {
    const response = await api.post(
      environment.admin.addDevice(userId),
      newDevice
    );
    return response;
  } catch (error) {
    console.error(`Failed to create a new device for user ${userId}:`, error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get(environment.admin.users());
    return response;
  } catch (error) {
    console.error(`Failed to retrive users:`, error);
  }
}
