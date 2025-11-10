import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function to merge Tailwind CSS class names
 * Helps with conditional class application and prevents conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Calculate reading time for a given text
 * Assumes average reading speed of 200 words per minute
 */
export function readingTime(text: string): { text: string; minutes: number; words: number } {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return {
    text: `${minutes} min read`,
    minutes,
    words,
  };
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Validate email format using regex
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Create a URL-friendly slug from a title
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Get the base URL for the site
 */
export function getBaseUrl(): string {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

/**
 * Generate OG image URL using Cloudinary
 * Falls back to a simple SVG if Cloudinary is not configured
 */
export function getOgImageUrl(title: string, description?: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (cloudName) {
    // Use Cloudinary transformation URL
    const text = encodeURIComponent(title);
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,h_630,c_fill,q_auto,f_auto/l_text:Arial_60_bold:${text}/og-template.png`;
  }

  // Fallback to local OG image generator
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/og?title=${encodeURIComponent(title)}${description ? `&description=${encodeURIComponent(description)}` : ''}`;
}

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDate<T extends { date: string }>(posts: T[]): T[] {
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get unique tags from posts
 */
export function getUniqueTags<T extends { tags?: string[] }>(posts: T[]): string[] {
  const allTags = posts.flatMap((post) => post.tags || []);
  return Array.from(new Set(allTags)).sort();
}

/**
 * Filter posts by tag
 */
export function filterPostsByTag<T extends { tags?: string[] }>(posts: T[], tag: string): T[] {
  return posts.filter((post) => post.tags?.includes(tag));
}

/**
 * Paginate an array
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): {
  items: T[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} {
  const totalPages = Math.ceil(items.length / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: items.slice(startIndex, endIndex),
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
