import axios from "axios";
import { getToken } from "../tokenService/tokenService.jsx";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = getToken();
  // console.log("accessToken from getToken():", accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  const apiKey = import.meta.env.VITE_API_KEY;

  // if (config.url.includes("/analytics") || config.url.includes("/alumni-of-day")) {
  //   config.headers["x-api-key"] = apiKey;
  // }
    config.headers["x-api-key"] = apiKey;

  return config;
});

export default api;