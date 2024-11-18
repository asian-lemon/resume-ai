// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine classes with Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sleep/delay utility
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Format date strings
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Rate limit helper
export const createRateLimiter = (requestsPerMinute: number) => {
  const requests: number[] = [];
  
  return {
    async waitForRateLimit(): Promise<void> {
      const now = Date.now();
      // Remove requests older than 1 minute
      while (requests.length && requests[0] < now - 60000) {
        requests.shift();
      }
      
      if (requests.length >= requestsPerMinute) {
        const oldestRequest = requests[0];
        const waitTime = oldestRequest + 60000 - now;
        if (waitTime > 0) {
          await sleep(waitTime);
        }
      }
      
      requests.push(now);
    }
  };
};

// File size formatter
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Retry function with exponential backoff
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options;
  
  let attempt = 1;
  let delay = initialDelay;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }
      
      await sleep(delay);
      delay = Math.min(delay * backoffFactor, maxDelay);
      attempt++;
    }
  }
}

// Check if running on server
export const isServer = typeof window === 'undefined';

// Parse error messages
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random ID
export const generateId = (length: number = 8): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(n => n.toString(36))
    .join('')
    .slice(0, length);
};

// Remove HTML tags
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};