import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { generatePostMetadata, generateArticleJsonLd, JsonLd } from '@/components/SEO';
import MDXComponents from '@/components/MDXComponents';

/**
 * Dynamic Blog Post Page
 * Renders individual blog posts with MDX content
 */

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all posts
export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for the post
export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post || !post.published) {
    return {};
  }

  return generatePostMetadata({
    title: post.title,
    description: post.description,
    slug: post.slug,
    date: post.date,
    image: post.heroImage,
    tags: post.tags,
    authors: post.authors,
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  // Return 404 if post not found or not published
  if (!post || !post.published) {
    notFound();
  }

  // Prepare MDX content
  const MDXContent = useMDXComponent(post.body.code);

  // Generate JSON-LD for SEO
  const jsonLd = generateArticleJsonLd({
    title: post.title,
    description: post.description,
    slug: post.slug,
    date: post.date,
    image: post.heroImage,
    authors: post.authors,
  });

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={jsonLd} />

      <article className="bg-background">
        {/* Hero Section */}
        <header className="border-b border-border">
          <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>
              <span>/</span>
              <span className="text-foreground">{post.title}</span>
            </nav>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {post.title}
            </h1>

            {/* Description */}
            <p className="mb-6 text-xl text-muted-foreground">{post.description}</p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>

              {post.readingTime && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{post.readingTime.text}</span>
                  </div>
                </>
              )}

              {post.authors && post.authors.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{post.authors.join(', ')}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hero Image */}
          {post.heroImage && (
            <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted">
              <Image
                src={post.heroImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXContent components={MDXComponents} />
          </div>

          {/* Share Section */}
          <div className="mt-12 border-t border-border pt-8">
            <h3 className="mb-4 text-lg font-semibold">Share this post</h3>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.SITE_URL}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                Tweet
              </a>
            </div>
          </div>

          {/* Navigation to other posts */}
          <div className="mt-12 border-t border-border pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = Number(process.env.REVALIDATE_TIME) || 60;
