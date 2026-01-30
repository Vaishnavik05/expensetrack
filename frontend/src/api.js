import axios from "axios";

const api = axios.create({
  baseURL: "https://expensetrack-production-7464.up.railway.app/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Request interceptor - token:", token ? token.substring(0, 20) + "..." : "NO TOKEN");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set");
    } else {
      console.warn("No token found in localStorage for request to:", config.url);
    }
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("401 Unauthorized - clearing token");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
