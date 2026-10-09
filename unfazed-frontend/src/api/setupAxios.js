import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = rawApiUrl.replace(/\/+$/, "");

axios.interceptors.request.use((config) => {
  if (
    typeof config.url === "string" &&
    /^http:\/\/localhost:5000/i.test(config.url)
  ) {
    config.url = config.url.replace(
      /^http:\/\/localhost:5000/i,
      API_URL
    );
  }

  return config;
});

export default axios;

