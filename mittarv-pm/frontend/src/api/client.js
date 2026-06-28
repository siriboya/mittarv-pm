import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:5000/api",
  headers: {
    "x-api-key": process.env.REACT_APP_API_KEY || "mittarv_secret_key_123",
  },
});

export default api;
