import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const registerApi = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginApi = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getCurrentUserApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export default api;
