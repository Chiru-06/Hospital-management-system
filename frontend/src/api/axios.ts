import axios from 'axios';

// Always use the deployed backend for all API calls
const api = axios.create({
  baseURL: 'https://chiragchiru.pythonanywhere.com/api', // PythonAnywhere backend with /api prefix
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Only set to true if your backend uses cookies for auth; set to false if using JWT in headers
});

export default api;