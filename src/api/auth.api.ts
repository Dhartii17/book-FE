import { api } from "./client";
import type { LoginInput, LoginResponse, RegisterInput, User } from "../types";
const normalizeUser = (v: any): User => { const u = v?.user ?? v; return { id: String(u?.id ?? u?._id ?? ""), name: String(u?.name ?? "User"), email: String(u?.email ?? ""), role: u?.role === "admin" ? "admin" : "user" }; };
export async function login(input: LoginInput): Promise<LoginResponse> { const { data } = await api.post("/auth/login", input); const d = data.data ?? data; return { token: d.token, user: normalizeUser(d.user) }; }
export async function register(input: RegisterInput): Promise<LoginResponse> { const { data } = await api.post("/auth/register", input); const d = data.data ?? data; return { token: d.token, user: normalizeUser(d.user) }; }
export async function fetchMe(): Promise<User> { const { data } = await api.get("/auth/me"); return normalizeUser(data.data ?? data); }
