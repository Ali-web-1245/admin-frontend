import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Har request ke saath JWT bhejo (localStorage "adminToken" se)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 aaye to token clear karke /login par redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(err);
  }
);

// Backend har route par { success, data, message } envelope use karta hai —
// yeh helper borough aage .data nikaal leta hai
export async function getData(url, config = {}) {
  const res = await api.get(url, config);
  return res.data?.data ?? res.data;
}

export default api;
