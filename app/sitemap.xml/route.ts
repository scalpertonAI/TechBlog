import { NextResponse } from 'next/server';
import { allPosts } from 'contentlayer/generated';
import { getBaseUrl } from '@/lib/utils';

/**
 * Sitemap Generator
 * Generates an XML sitemap for search engines
 *
 * GET /sitemap.xml
 */
export async function GET() {
  const baseUrl = getBaseUrl();
  const posts = allPosts.filter((post) => post.published);

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.9,
    },
  ];

  // Blog posts
  const postPages = posts.map((post) => ({
    url: `${baseUrl}${post.url}`,
    lastmod: new Date(post.date).toISOString(),
    changefreq: 'weekly',
    priority: 0.8,
  }));

  const allPages = [...staticPages, ...postPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
