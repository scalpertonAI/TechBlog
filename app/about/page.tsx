import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about TechBlog and our mission to share knowledge.',
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">About TechBlog</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead text-xl text-muted-foreground">
            TechBlog is a modern, open-source blogging platform built for developers who want
            to share their knowledge and experiences.
          </p>

          <h2>Our Mission</h2>
          <p>
            We believe in making web development knowledge accessible to everyone. Our platform
            is designed to provide:
          </p>
          <ul>
            <li>High-quality technical content</li>
            <li>In-depth tutorials and guides</li>
            <li>Best practices and real-world examples</li>
            <li>A community-driven approach to learning</li>
          </ul>

          <h2>Technology Stack</h2>
          <p>
            This blog is built with cutting-edge technologies to ensure the best performance and
            developer experience:
          </p>
          <ul>
            <li>
              <strong>Next.js 15</strong> - React framework with App Router
            </li>
            <li>
              <strong>TypeScript</strong> - Type-safe development
            </li>
            <li>
              <strong>MDX</strong> - Markdown with React components
            </li>
            <li>
              <strong>Tailwind CSS v4</strong> - Utility-first styling
            </li>
            <li>
              <strong>Meilisearch</strong> - Lightning-fast search
            </li>
            <li>
              <strong>Beehiiv</strong> - Newsletter management
            </li>
            <li>
              <strong>Plausible</strong> - Privacy-friendly analytics
            </li>
            <li>
              <strong>Sentry</strong> - Error monitoring
            </li>
          </ul>

          <h2>Open Source</h2>
          <p>
            This entire platform is open source and available on{' '}
            <a
              href="https://github.com/yourusername/techblog"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            . Feel free to:
          </p>
          <ul>
            <li>Use it for your own blog</li>
            <li>Contribute improvements</li>
            <li>Report issues</li>
            <li>Suggest new features</li>
          </ul>

          <h2>Get in Touch</h2>
          <p>We'd love to hear from you! Connect with us on:</p>
          <ul>
            <li>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="mailto:hello@yourdomain.com">Email</a>
            </li>
          </ul>

          <div className="not-prose mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Read Our Blog
              <svg
                className="h-4 w-4"
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
          </div>
        </div>
      </div>
    </div>
  );
}
