import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Pagination Component
 * Displays pagination controls for blog posts
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = '/blog',
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show only a subset of pages if there are too many
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return pages;
    }

    if (currentPage <= 3) {
      return [...pages.slice(0, 5), '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Go to previous page"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground opacity-50">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="hidden items-center gap-1 sm:flex">
        {pageNumbers.map((pageNum, idx) =>
          pageNum === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Link
              key={pageNum}
              href={buildUrl(pageNum as number)}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors',
                pageNum === currentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-background hover:bg-accent hover:text-accent-foreground'
              )}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          )
        )}
      </div>

      {/* Current Page Indicator (Mobile) */}
      <div className="flex items-center sm:hidden">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Go to next page"
        >
          Next
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground opacity-50">
          Next
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}
