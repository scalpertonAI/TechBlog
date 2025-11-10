import { NextResponse } from 'next/server';
import { allPosts } from 'contentlayer/generated';
import { sortPostsByDate, getBaseUrl } from '@/lib/utils';
import { siteConfig } from '@/components/SEO';

/**
 * RSS Feed Generator
 * Generates an RSS 2.0 feed for all published blog posts
 *
 * GET /rss.xml
 */
export async function GET() {
  const baseUrl = getBaseUrl();
  const posts = sortPostsByDate(allPosts.filter((post) => post.published));

  const rssItems = posts
    .map((post) => {
      const postUrl = `${baseUrl}${post.url}`;
      const pubDate = new Date(post.date).toUTCString();

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.authors?.map((author) => `<author>${author}</author>`).join('\n      ') || ''}
      ${post.tags?.map((tag) => `<category>${tag}</category>`).join('\n      ') || ''}
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <description>${siteConfig.description}</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
