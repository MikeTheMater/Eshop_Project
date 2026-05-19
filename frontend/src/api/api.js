import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Only clear token + redirect on 401 if we're NOT on an auth endpoint.
// This prevents the login/register call itself from triggering a redirect.
api.interceptors.response.use(
  (response) => response,          // ← 2xx responses pass through untouched
  (error) => {
    const url = error.config?.url || "";
    const isAuthCall = url.includes("/auth/");

    if (error.response?.status === 401 && !isAuthCall) {
      // Token expired or invalid — clear it and go back to login
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    // Always re-throw so the catch() in LoginPage still sees the error
    return Promise.reject(error);
  }
);

export default api;

// --- Auth helpers ---

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}