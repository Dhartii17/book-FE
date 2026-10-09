import { api } from "./client";
import type { Book, BookInput, PageMeta } from "../types";
export async function fetchBooks(params: { page?: number; limit?: number; search?: string } = {}) { const { data } = await api.get("/books", { params }); return { books: data.data as Book[], pagination: data.pagination as PageMeta }; }
export async function createBook(input: BookInput) { const { data } = await api.post("/books", input); return data.data as Book; }
export async function updateBook(id: string, input: BookInput) { const { data } = await api.patch(`/books/${id}`, input); return data.data as Book; }
export async function deleteBook(id: string) { await api.delete(`/books/${id}`); }
export async function fetchUsers(params: { page?: number; limit?: number; search?: string } = {}) { const { data } = await api.get("/users", { params }); return { users: data.data as Array<{id:string;name:string;email:string;role:"admin"|"user";createdAt:string}>, pagination: data.pagination as PageMeta }; }
