export type Role = "admin" | "user";
export interface User { id: string; name: string; email: string; role: Role; createdAt?: string; }
export interface LoginInput { email: string; password: string; }
export interface RegisterInput { name: string; email: string; password: string; }
export interface LoginResponse { token: string; user: User; }
export interface Book { _id: string; title: string; author: string; description: string; isbn: string; category: string; publishedYear?: number; createdBy: { _id?: string; id?: string; name: string; email?: string } | string; createdAt: string; updatedAt: string; }
export type BookInput = Omit<Book, "_id" | "createdBy" | "createdAt" | "updatedAt">;
export interface PageMeta { page: number; limit: number; total: number; totalPages: number; }
