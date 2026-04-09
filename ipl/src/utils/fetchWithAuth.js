// src/utils/fetchWithAuth.js
import { BASE_URL } from "../pages/config";

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token"); // get JWT token from localStorage

  options.headers = {
    ...(options.headers || {}),             // keep any existing headers
    Authorization: `Bearer ${token}`,       // attach token automatically
    "Content-Type": "application/json",    // JSON content
  };

  return fetch(`${BASE_URL}${endpoint}`, options);
};