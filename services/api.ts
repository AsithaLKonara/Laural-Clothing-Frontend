import axios from "axios";

// In the future, replace the baseURL with the actual backend API URL
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("API URL configured as:", process.env.NEXT_PUBLIC_API_URL);

export default api;
