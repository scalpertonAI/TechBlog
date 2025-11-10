'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Custom MDX components for enhanced content rendering
 * These components replace default HTML elements in MDX files
 */

// Copy button for code blocks
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      aria-label="Copy code"
    >
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  );
}

// Enhanced code block with copy functionality
function Pre({ children, ...props }: React.HTMLProps<HTMLPreElement>) {
  const textContent =
    children && typeof children === 'object' && 'props' in children
      ? String(children.props.children)
      : '';

  return (
    <div className="relative">
      <pre {...props} className="overflow-x-auto">
        {children}
      </pre>
      <CopyButton text={textContent} />
    </div>
  );
}

// Responsive image component using next/image
function ResponsiveImage({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;

  return (
    <div className="relative my-8 overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={alt || ''}
        width={1200}
        height={630}
        className="h-auto w-full"
        {...props}
      />
    </div>
  );
}

// Callout box component for important notes
interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  children: React.ReactNode;
}

function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
    success: 'border-green-500 bg-green-50 dark:bg-green-950',
    error: 'border-red-500 bg-red-50 dark:bg-red-950',
  };

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
    error: '❌',
  };

  return (
    <div className={cn('my-6 rounded-lg border-l-4 p-4', styles[type])}>
      <div className="flex gap-3">
        <span className="text-xl">{icons[type]}</span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

// Custom link component with external link indicator
function CustomLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http');
  const isAnchor = href?.startsWith('#');

  if (isAnchor) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1"
        {...props}
      >
        {children}
        <svg
          className="inline h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

// YouTube embed component
interface YouTubeProps {
  id: string;
  title?: string;
}

function YouTube({ id, title = 'YouTube video' }: YouTubeProps) {
  return (
    <div className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

// Tweet embed component (simple version)
interface TweetProps {
  id: string;
}

function Tweet({ id }: TweetProps) {
  return (
    <div className="my-8 flex justify-center">
      <blockquote className="twitter-tweet">
        <a href={`https://twitter.com/x/status/${id}`}>View tweet</a>
      </blockquote>
    </div>
  );
}

/**
 * Export all custom MDX components
 * These will be used by the MDX provider
 */
export const MDXComponents = {
  // Override default HTML elements
  pre: Pre,
  img: ResponsiveImage,
  a: CustomLink,

  // Custom components available in MDX
  Image: ResponsiveImage,
  Callout,
  YouTube,
  Tweet,
};

export default MDXComponents;
