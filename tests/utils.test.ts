import { describe, it, expect } from 'vitest';
import {
  formatDate,
  isValidEmail,
  slugify,
  truncate,
  readingTime,
  sortPostsByDate,
  getUniqueTags,
  filterPostsByTag,
  paginate,
} from '../lib/utils';

describe('Utils Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBe('January 15, 2024');
    });

    it('handles string dates', () => {
      const formatted = formatDate('2024-01-15');
      expect(formatted).toContain('January');
      expect(formatted).toContain('2024');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('This is a Test!')).toBe('this-is-a-test');
    });

    it('handles special characters', () => {
      expect(slugify('Hello@World#2024')).toBe('helloworld2024');
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });

    it('removes leading/trailing hyphens', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      expect(truncate(text, 20)).toBe('This is a very long...');
    });

    it('does not truncate short text', () => {
      const text = 'Short text';
      expect(truncate(text, 20)).toBe('Short text');
    });
  });

  describe('readingTime', () => {
    it('calculates reading time', () => {
      const text = 'word '.repeat(200);
      const result = readingTime(text);

      expect(result.minutes).toBe(1);
      expect(result.words).toBe(200);
      expect(result.text).toContain('min read');
    });

    it('rounds up reading time', () => {
      const text = 'word '.repeat(250);
      const result = readingTime(text);

      expect(result.minutes).toBe(2);
    });
  });

  describe('sortPostsByDate', () => {
    it('sorts posts by date descending', () => {
      const posts = [
        { date: '2024-01-01', title: 'First' },
        { date: '2024-01-15', title: 'Third' },
        { date: '2024-01-10', title: 'Second' },
      ];

      const sorted = sortPostsByDate(posts);

      expect(sorted[0].title).toBe('Third');
      expect(sorted[1].title).toBe('Second');
      expect(sorted[2].title).toBe('First');
    });
  });

  describe('getUniqueTags', () => {
    it('extracts unique tags', () => {
      const posts = [
        { tags: ['React', 'Next.js'] },
        { tags: ['React', 'TypeScript'] },
        { tags: ['Next.js', 'Tailwind'] },
      ];

      const tags = getUniqueTags(posts);

      expect(tags).toEqual(['Next.js', 'React', 'Tailwind', 'TypeScript']);
    });

    it('handles posts without tags', () => {
      const posts = [{ tags: ['React'] }, {}, { tags: undefined }];

      const tags = getUniqueTags(posts);

      expect(tags).toEqual(['React']);
    });
  });

  describe('filterPostsByTag', () => {
    it('filters posts by tag', () => {
      const posts = [
        { title: 'Post 1', tags: ['React', 'Next.js'] },
        { title: 'Post 2', tags: ['Vue', 'TypeScript'] },
        { title: 'Post 3', tags: ['React', 'TypeScript'] },
      ];

      const filtered = filterPostsByTag(posts, 'React');

      expect(filtered).toHaveLength(2);
      expect(filtered[0].title).toBe('Post 1');
      expect(filtered[1].title).toBe('Post 3');
    });
  });

  describe('paginate', () => {
    it('paginates items correctly', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

      const page1 = paginate(items, 1, 10);
      expect(page1.items).toHaveLength(10);
      expect(page1.totalPages).toBe(3);
      expect(page1.currentPage).toBe(1);
      expect(page1.hasNextPage).toBe(true);
      expect(page1.hasPrevPage).toBe(false);

      const page2 = paginate(items, 2, 10);
      expect(page2.items).toHaveLength(10);
      expect(page2.currentPage).toBe(2);
      expect(page2.hasNextPage).toBe(true);
      expect(page2.hasPrevPage).toBe(true);

      const page3 = paginate(items, 3, 10);
      expect(page3.items).toHaveLength(5);
      expect(page3.hasNextPage).toBe(false);
    });

    it('handles out of range pages', () => {
      const items = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));

      const result = paginate(items, 10, 5);
      expect(result.currentPage).toBe(2); // Corrected to last valid page
    });
  });
});
