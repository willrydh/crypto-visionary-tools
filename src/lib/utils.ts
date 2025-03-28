
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as an integer (no decimal places)
 */
export function formatInteger(value: number): string {
  return Math.round(value).toLocaleString()
}

/**
 * Format a number as currency
 */
export function formatCurrency(value: number): string {
  return `$${formatInteger(value)}`
}

