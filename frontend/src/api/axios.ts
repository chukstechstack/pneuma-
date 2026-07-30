import axios from "axios";

const api = axios.create({
  baseURL: (import.meta as any).env.DEV 
    ? "http://localhost:4000" 
    : ((import.meta as any).env.VITE_API_URL || "https://pneuma-api-0bvr.onrender.com"), 
  withCredentials: true,
});

export default api;
 