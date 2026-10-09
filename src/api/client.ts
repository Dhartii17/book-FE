import axios from "axios";
export const tokenStore = {
  get: () => localStorage.getItem("book-app-token"),
  set: (token: string) => localStorage.setItem("book-app-token", token),
  clear: () => localStorage.removeItem("book-app-token"),
};
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api", headers: { "Content-Type": "application/json" } });
api.interceptors.request.use((config) => { const token = tokenStore.get(); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export function errorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) return error.response?.data?.message ?? error.message ?? fallback;
  return error instanceof Error ? error.message : fallback;
}
