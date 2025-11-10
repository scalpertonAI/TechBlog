import { allPosts } from 'contentlayer/generated';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import { sortPostsByDate, paginate, getUniqueTags, filterPostsByTag } from '@/lib/utils';
import { generateBlogMetadata } from '@/components/SEO';
import Link from 'next/link';

/**
 * Blog Listing Page
 * Displays all blog posts with pagination and tag filtering
 */

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    tag?: string;
  }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  return generateBlogMetadata(params.tag);
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const selectedTag = params.tag;
  const pageSize = 12;

  // Get all published posts
  let posts = allPosts.filter((post) => post.published);
  posts = sortPostsByDate(posts);

  // Filter by tag if specified
  if (selectedTag) {
    posts = filterPostsByTag(posts, selectedTag);
  }

  // Get all available tags
  const allTags = getUniqueTags(allPosts.filter((post) => post.published));

  // Paginate posts
  const { items: paginatedPosts, totalPages, hasNextPage, hasPrevPage } = paginate(
    posts,
    currentPage,
    pageSize
  );

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            {selectedTag ? `Posts tagged "${selectedTag}"` : 'All Posts'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {selectedTag
              ? `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} found`
              : `Browse all ${posts.length} posts`}
          </p>
        </div>
      </section>

      {/* Tags Filter */}
      <section className="border-b border-border bg-background py-6">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-sm font-medium text-muted-foreground">Filter:</span>
            <Link
              href="/blog"
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !selectedTag
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-background hover:bg-accent'
              }`}
            >
              All
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-background hover:bg-accent'
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedPosts.map((post) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/blog"
                    searchParams={selectedTag ? { tag: selectedTag } : {}}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                No posts found {selectedTag && `with tag "${selectedTag}"`}.
              </p>
              {selectedTag && (
                <Link
                  href="/blog"
                  className="mt-4 inline-block text-primary hover:underline"
                >
                  View all posts
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
