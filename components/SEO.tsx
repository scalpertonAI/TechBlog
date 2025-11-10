import { Metadata } from 'next';
import { getBaseUrl, getOgImageUrl } from '@/lib/utils';

/**
 * SEO Configuration
 * Default metadata for the site
 */
export const siteConfig = {
  name: 'TechBlog',
  description: 'A modern, production-ready blog built with Next.js, TypeScript, and MDX',
  url: getBaseUrl(),
  author: 'Your Name',
  links: {
    twitter: 'https://twitter.com/yourusername',
    github: 'https://github.com/yourusername',
  },
};

/**
 * Generate metadata for a blog post
 */
export function generatePostMetadata({
  title,
  description,
  slug,
  date,
  image,
  tags,
  authors,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
  tags?: string[];
  authors?: string[];
}): Metadata {
  const url = `${siteConfig.url}/blog/${slug}`;
  const ogImage = image || getOgImageUrl(title, description);

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    authors: authors?.map((name) => ({ name })) || [{ name: siteConfig.author }],
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: date,
      authors: authors || [siteConfig.author],
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@yourusername', // Replace with your Twitter handle
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for the home page
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: siteConfig.name,
    description: siteConfig.description,
    openGraph: {
      type: 'website',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: getOgImageUrl(siteConfig.name, siteConfig.description),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [getOgImageUrl(siteConfig.name, siteConfig.description)],
    },
  };
}

/**
 * Generate metadata for the blog listing page
 */
export function generateBlogMetadata(tag?: string): Metadata {
  const title = tag ? `Posts tagged "${tag}"` : 'Blog';
  const description = tag
    ? `All posts tagged with ${tag}`
    : 'Read our latest articles and tutorials';

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    openGraph: {
      type: 'website',
      url: tag ? `${siteConfig.url}/blog?tag=${tag}` : `${siteConfig.url}/blog`,
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}

/**
 * Generate JSON-LD structured data for a blog post
 * Helps search engines understand the content better
 */
export function generateArticleJsonLd({
  title,
  description,
  slug,
  date,
  image,
  authors,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
  authors?: string[];
}) {
  const url = `${siteConfig.url}/blog/${slug}`;
  const ogImage = image || getOgImageUrl(title, description);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: ogImage,
    datePublished: date,
    dateModified: date,
    author: authors?.map((name) => ({
      '@type': 'Person',
      name,
    })) || [
      {
        '@type': 'Person',
        name: siteConfig.author,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Generate JSON-LD structured data for the organization
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    sameAs: [siteConfig.links.twitter, siteConfig.links.github],
  };
}

/**
 * JSON-LD Script Component
 * Renders structured data as a script tag
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
