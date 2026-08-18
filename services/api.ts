import axios from "axios";

// In the future, replace the baseURL with the actual backend API URL
export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
