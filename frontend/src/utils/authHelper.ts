export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleLogout = () => {
  localStorage.removeItem('authToken');
  console.log('Logout successful!');
};