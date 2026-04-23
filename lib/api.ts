import type {
  User,
  UsersResponse,
  LoginResponse,
  GenderFilter,
  SortField,
  SortOrder,
} from "@/types/user";

const BASE_URL = "https://dummyjson.com";
const PAGE_SIZE = 30;

// ─── Helper ───────────────────────────────────────────────────────────────────
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Users List ───────────────────────────────────────────────────────────────
export interface GetUsersParams {
  page: number;
  limit?: number;
  sortField?: SortField;
  sortOrder?: SortOrder;
}

export async function getUsers({
  page,
  limit = PAGE_SIZE,
  sortField,
  sortOrder,
}: GetUsersParams): Promise<UsersResponse> {
  const skip = (page - 1) * limit;
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });
  if (sortField) {
    params.set("sortBy", sortField);
    params.set("order", sortOrder ?? "asc");
  }
  return fetcher<UsersResponse>(`${BASE_URL}/users?${params.toString()}`);
}

// ─── Search ───────────────────────────────────────────────────────────────────
export async function searchUsers(q: string): Promise<UsersResponse> {
  return fetcher<UsersResponse>(
    `${BASE_URL}/users/search?q=${encodeURIComponent(q)}`
  );
}

// ─── Filter by key/value ──────────────────────────────────────────────────────
export async function filterUsers(
  key: string,
  value: string
): Promise<UsersResponse> {
  const params = new URLSearchParams({ key, value });
  return fetcher<UsersResponse>(`${BASE_URL}/users/filter?${params.toString()}`);
}

// ─── Filter by gender ────────────────────────────────────────────────────────
export async function filterByGender(
  gender: GenderFilter
): Promise<UsersResponse> {
  return filterUsers("gender", gender);
}

// ─── Filter by hair color ─────────────────────────────────────────────────────
export async function filterByHairColor(color: string): Promise<UsersResponse> {
  return filterUsers("hair.color", color);
}

// ─── Single User ──────────────────────────────────────────────────────────────
export async function getUser(id: number): Promise<User> {
  return fetcher<User>(`${BASE_URL}/users/${id}`);
}

// ─── All Users (for stats) ────────────────────────────────────────────────────
export async function getAllUsers(): Promise<UsersResponse> {
  return fetcher<UsersResponse>(`${BASE_URL}/users?limit=0`);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  return fetcher<LoginResponse>(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}
