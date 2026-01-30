import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "https://expensetrack-production-7464.up.railway.app",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
