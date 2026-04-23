import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function maskString(
  value: string,
  keepLast = 4,
  maskChar = "•"
): string {
  if (value.length <= keepLast) return value;
  return maskChar.repeat(value.length - keepLast) + value.slice(-keepLast);
}

export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, "");
  const last4 = cleaned.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function maskIBAN(iban: string): string {
  if (iban.length <= 8) return iban;
  return iban.slice(0, 4) + "•".repeat(iban.length - 8) + iban.slice(-4);
}

export function maskSSN(ssn: string): string {
  const digits = ssn.replace(/\D/g, "");
  return `•••-••-${digits.slice(-4)}`;
}

export function maskEIN(ein: string): string {
  const digits = ein.replace(/\D/g, "");
  return `••-•••${digits.slice(-4)}`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
