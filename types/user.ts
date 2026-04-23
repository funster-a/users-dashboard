// ─── Hair ────────────────────────────────────────────────────────────────────
export interface Hair {
  color: string;
  type: string;
}

// ─── Coordinates ─────────────────────────────────────────────────────────────
export interface Coordinates {
  lat: number;
  lng: number;
}

// ─── Address ──────────────────────────────────────────────────────────────────
export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

// ─── Bank ─────────────────────────────────────────────────────────────────────
export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

// ─── Company ──────────────────────────────────────────────────────────────────
export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

// ─── Crypto ───────────────────────────────────────────────────────────────────
export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: "male" | "female";
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: "admin" | "moderator" | "user";
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

// ─── Filter / Sort State ─────────────────────────────────────────────────────
export type SortField = "firstName" | "age";
export type SortOrder = "asc" | "desc";
export type GenderFilter = "male" | "female" | "";
export type ViewMode = "table" | "grid";

export interface FilterState {
  search: string;
  gender: GenderFilter;
  hairColor: string;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
}
