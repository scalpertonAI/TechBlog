'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { trackSearch } from '@/lib/analytics';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  tags?: string[];
}

/**
 * Search Bar Component
 * Provides instant search using Meilisearch
 */
export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();

        if (data.success && data.results) {
          setResults(data.results);
          setIsOpen(true);

          // Track search
          trackSearch(query, data.results.length);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search posts..."
          className="w-full rounded-md border border-input bg-background px-4 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-md border border-border bg-popover p-2 shadow-lg">
          <div className="space-y-1">
            {results.map((result) => (
              <Link
                key={result.id}
                href={result.url}
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
                className="block rounded-md p-3 transition-colors hover:bg-accent"
              >
                <div className="font-medium">{result.title}</div>
                <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {result.description}
                </div>
                {result.tags && result.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-2 border-t border-border pt-2 text-center">
            <Link
              href={`/blog?search=${encodeURIComponent(query)}`}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              className="text-sm text-primary hover:underline"
            >
              See all results
            </Link>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query && !isLoading && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-md border border-border bg-popover p-4 text-center shadow-lg">
          <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
