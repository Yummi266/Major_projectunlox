import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["Authorization"];
  }
};

const initialToken = localStorage.getItem("token");
if (initialToken) {
  setAuthToken(initialToken);
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleAuthError = (error) => {
  if (error.response && error.response.status === 401) {
    const currentPath = window.location.pathname;
    if (
      currentPath !== "/login" &&
      currentPath !== "/register" &&
      currentPath !== "/"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      setAuthToken(null);
      window.location.href = "/login?expired=true";
    }
  }
  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, handleAuthError);
axios.interceptors.response.use((response) => response, handleAuthError);

export const authService = {
  login: async (email, password, role) => {
    const response = await api.post("/auth/login", {
      email,
      password,
      role
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  registerTherapist: async (data) => {
    const response = await api.post("/auth/therapist/register", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  registerClient: async (data) => {
    const response = await api.post("/auth/client/register", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) return false;
      const decoded = JSON.parse(atob(payloadBase64));
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        setAuthToken(null);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  getUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  getRole: () => {
    return localStorage.getItem("role");
  },

  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setAuthToken(null);
    window.location.href = "/login";
  }
};

export default api;
