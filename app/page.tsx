import Link from 'next/link';
import { allPosts } from 'contentlayer/generated';
import PostCard from '@/components/PostCard';
import { sortPostsByDate } from '@/lib/utils';
import { generateHomeMetadata } from '@/components/SEO';

export const metadata = generateHomeMetadata();

/**
 * Home Page
 * Displays featured posts and a hero section
 */
export default function HomePage() {
  // Get published posts sorted by date
  const posts = sortPostsByDate(allPosts.filter((post) => post.published));

  // Get featured posts
  const featuredPosts = posts.filter((post) => post.featured).slice(0, 1);
  const recentPosts = posts.slice(0, 6);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to <span className="text-primary">TechBlog</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Insights, tutorials, and resources for modern web development.
              Built with Next.js, TypeScript, and MDX.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/blog"
                className="rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse Posts
              </Link>
              <Link
                href="#newsletter"
                className="rounded-md border border-border bg-background px-6 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="border-b border-border py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold tracking-tight">Featured</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  title={post.title}
                  description={post.description}
                  date={post.date}
                  slug={post.slug}
                  tags={post.tags}
                  heroImage={post.heroImage}
                  readingTime={post.readingTime}
                  featured={post.featured}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Recent Posts</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard
                key={post._id}
                title={post.title}
                description={post.description}
                date={post.date}
                slug={post.slug}
                tags={post.tags}
                heroImage={post.heroImage}
                readingTime={post.readingTime}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border bg-muted/40 py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{posts.length}+</div>
              <div className="mt-2 text-sm text-muted-foreground">Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {new Set(posts.flatMap((p) => p.tags || [])).size}+
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Topics Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">100%</div>
              <div className="mt-2 text-sm text-muted-foreground">Open Source</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
