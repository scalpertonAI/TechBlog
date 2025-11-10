import { NextRequest, NextResponse } from 'next/server';
import { allPosts } from 'contentlayer/generated';
import {
  indexPosts,
  configureSearchIndex,
  clearSearchIndex,
  type IndexedPost,
} from '@/lib/meilisearch';
import { captureException } from '@/lib/sentry';
import { truncate } from '@/lib/utils';

/**
 * Reindex API Route
 * Triggers reindexing of all posts in Meilisearch
 *
 * This endpoint should be called after deployment or when content changes
 * Protected by REINDEX_SECRET environment variable
 *
 * POST /api/reindex
 * Headers: { 'x-reindex-secret': 'your-secret' }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const secret = request.headers.get('x-reindex-secret');
    const expectedSecret = process.env.REINDEX_SECRET;

    if (!expectedSecret) {
      console.error('REINDEX_SECRET is not configured');
      return NextResponse.json(
        {
          success: false,
          message: 'Reindex endpoint is not configured.',
        },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.warn('Unauthorized reindex attempt');
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Invalid secret.',
        },
        { status: 401 }
      );
    }

    // Check if Meilisearch is configured
    if (!process.env.MEILI_HOST || !process.env.MEILI_MASTER_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'Meilisearch is not configured.',
        },
        { status: 500 }
      );
    }

    // Get all published posts
    const posts = allPosts.filter((post) => post.published);

    // Transform posts for indexing
    const indexedPosts: IndexedPost[] = posts.map((post) => ({
      id: post._id,
      title: post.title,
      description: post.description,
      content: truncate(post.body.raw, 500), // Index excerpt only to save space
      tags: post.tags || [],
      url: post.url,
      date: new Date(post.date).getTime(),
      published: post.published,
    }));

    // Configure index settings
    await configureSearchIndex();

    // Clear existing index and reindex
    await clearSearchIndex();
    const result = await indexPosts(indexedPosts);

    return NextResponse.json({
      success: true,
      message: `Successfully indexed ${indexedPosts.length} posts.`,
      count: indexedPosts.length,
      taskUid: result?.taskUid,
    });
  } catch (error) {
    console.error('Reindex API error:', error);
    captureException(error, {
      tags: { api: 'reindex' },
      extra: { endpoint: '/api/reindex' },
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to reindex. Please try again.',
      },
      { status: 500 }
    );
  }
}

// Only allow POST
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed. Use POST with x-reindex-secret header.',
    },
    { status: 405 }
  );
}
