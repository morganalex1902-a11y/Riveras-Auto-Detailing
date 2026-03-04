import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatErrorMessage(error: unknown): string {
  // Handle Supabase API errors
  if (error && typeof error === 'object') {
    const err = error as any;

    // Supabase error format
    if (err.message) {
      return err.message;
    }

    // PostgreSQL/API error details
    if (err.details) {
      return err.details;
    }

    // Supabase hint
    if (err.hint) {
      return err.hint;
    }

    // Generic error object fallback
    if (err.error) {
      return typeof err.error === 'string' ? err.error : formatErrorMessage(err.error);
    }
  }

  // Handle Error instances
  if (error instanceof Error) {
    return error.message;
  }

  // Handle strings
  if (typeof error === 'string') {
    return error;
  }

  // Fallback for unknown error types
  return 'An unknown error occurred';
}
