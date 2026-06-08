import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";

    // Only force logout on 401 if it's NOT a known authenticated endpoint.
    // Auth calls, orders, addresses handle their own errors locally.
    const isProtectedCall =
      url.includes("/auth/") ||
      url.includes("/orders") ||
      url.includes("/addresses");

    if (error.response?.status === 401 && !isProtectedCall) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;

export function getToken()      { return localStorage.getItem("token"); }
export function setToken(token) { localStorage.setItem("token", token); }
export function removeToken()   { localStorage.removeItem("token"); }
export function isLoggedIn()    { return !!localStorage.getItem("token"); }