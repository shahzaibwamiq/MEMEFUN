import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes.
 * 
 * - `clsx` allows conditional class merging based on truthy values.
 * - `twMerge` resolves conflicting Tailwind classes (e.g., `px-4` vs. `px-2`).
 * 
 * @param inputs - A list of class values that may include strings, objects, or arrays.
 * @returns A merged class string with conflicts resolved.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
