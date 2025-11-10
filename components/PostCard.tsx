import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

/**
 * Post Card Component
 * Displays a blog post preview in a card format
 */
interface PostCardProps {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags?: string[];
  heroImage?: string;
  readingTime?: { text: string };
  featured?: boolean;
}

export default function PostCard({
  title,
  description,
  date,
  slug,
  tags,
  heroImage,
  readingTime,
  featured,
}: PostCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <Link href={`/blog/${slug}`} className="block">
        {/* Hero Image */}
        {heroImage && (
          <div className={`relative overflow-hidden bg-muted ${featured ? 'h-80' : 'h-48'}`}>
            <Image
              src={heroImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            />
            {featured && (
              <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Featured
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`p-6 ${featured ? 'md:p-8' : ''}`}>
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2
            className={`mb-2 font-bold tracking-tight text-card-foreground transition-colors group-hover:text-primary ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {title}
          </h2>

          {/* Description */}
          <p className={`text-muted-foreground ${featured ? 'text-base' : 'text-sm'} line-clamp-3`}>
            {description}
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={date}>{formatDate(date)}</time>
            {readingTime && (
              <>
                <span>•</span>
                <span>{readingTime.text}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
