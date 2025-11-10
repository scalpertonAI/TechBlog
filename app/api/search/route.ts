import { NextRequest, NextResponse } from 'next/server';
import { allPosts } from 'contentlayer/generated';
import { captureException } from '@/lib/sentry';

/**
 * Search API Route
 * Provides search functionality for blog posts
 *
 * Uses client-side Meilisearch when available,
 * Falls back to simple in-memory search if Meilisearch is unavailable
 *
 * GET /api/search?q=query&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = Number(searchParams.get('limit')) || 10;

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        results: [],
        count: 0,
      });
    }

    // Fallback: Simple in-memory search
    // This is used when Meilisearch is not available or as a backup
    const searchLower = query.toLowerCase();
    const publishedPosts = allPosts.filter((post) => post.published);

    const results = publishedPosts
      .map((post) => {
        // Calculate relevance score
        let score = 0;

        // Title matches are most important
        if (post.title.toLowerCase().includes(searchLower)) {
          score += 10;
        }

        // Description matches
        if (post.description.toLowerCase().includes(searchLower)) {
          score += 5;
        }

        // Tag matches
        if (post.tags?.some((tag) => tag.toLowerCase().includes(searchLower))) {
          score += 3;
        }

        // Content matches (if available)
        if (post.body?.raw && post.body.raw.toLowerCase().includes(searchLower)) {
          score += 1;
        }

        return {
          post,
          score,
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((result) => ({
        id: result.post._id,
        title: result.post.title,
        description: result.post.description,
        url: result.post.url,
        tags: result.post.tags,
        date: new Date(result.post.date).getTime(),
      }));

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
      fallback: true, // Indicates this is fallback search, not Meilisearch
    });
  } catch (error) {
    console.error('Search API error:', error);
    captureException(error, {
      tags: { api: 'search' },
      extra: { endpoint: '/api/search' },
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Search failed. Please try again.',
        results: [],
      },
      { status: 500 }
    );
  }
}
