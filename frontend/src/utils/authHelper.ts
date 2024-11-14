import { jwtDecode } from "jwt-decode";

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleLogout = () => {
  localStorage.removeItem('authToken');
  console.log('Logout successful!');
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.log("No token found, redirecting to sign-in.");
    return false;
  }

  try {
    const decodedToken: { exp?: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};