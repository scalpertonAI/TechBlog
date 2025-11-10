import { MeiliSearch } from 'meilisearch';

/**
 * Meilisearch client configuration
 * Server-side client uses master key for admin operations
 * Client-side should use search-only key (configured in .env)
 */

// Server-side client with admin privileges
export const meiliAdminClient =
  typeof window === 'undefined'
    ? new MeiliSearch({
        host: process.env.MEILI_HOST || 'http://localhost:7700',
        apiKey: process.env.MEILI_MASTER_KEY || '',
      })
    : null;

// Client-side search client (read-only)
export function getMeiliSearchClient() {
  if (typeof window === 'undefined') {
    throw new Error('Client should only be used on the browser');
  }

  return new MeiliSearch({
    host: process.env.NEXT_PUBLIC_MEILI_HOST || 'http://localhost:7700',
    apiKey: process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY || '',
  });
}

/**
 * Index name for blog posts
 */
export const POSTS_INDEX = 'posts';

/**
 * Type definition for indexed post
 */
export interface IndexedPost {
  id: string;
  title: string;
  description: string;
  content: string; // Excerpt or full content
  tags: string[];
  url: string;
  date: number; // Unix timestamp for sorting
  published: boolean;
}

/**
 * Configure the Meilisearch index settings
 * This should be run during initial setup or reindexing
 */
export async function configureSearchIndex() {
  if (!meiliAdminClient) {
    throw new Error('Meilisearch admin client is only available on the server');
  }

  const index = meiliAdminClient.index(POSTS_INDEX);

  // Configure searchable attributes
  await index.updateSearchableAttributes(['title', 'description', 'content', 'tags']);

  // Configure filterable attributes
  await index.updateFilterableAttributes(['tags', 'published', 'date']);

  // Configure sortable attributes
  await index.updateSortableAttributes(['date']);

  // Configure ranking rules
  await index.updateRankingRules([
    'words',
    'typo',
    'proximity',
    'attribute',
    'sort',
    'exactness',
  ]);

  // Configure displayed attributes
  await index.updateDisplayedAttributes(['id', 'title', 'description', 'tags', 'url', 'date']);

  console.log('✅ Meilisearch index configured successfully');
}

/**
 * Index posts in Meilisearch
 * @param posts Array of posts to index
 */
export async function indexPosts(posts: IndexedPost[]) {
  if (!meiliAdminClient) {
    throw new Error('Meilisearch admin client is only available on the server');
  }

  const index = meiliAdminClient.index(POSTS_INDEX);

  // Only index published posts
  const publishedPosts = posts.filter((post) => post.published);

  if (publishedPosts.length === 0) {
    console.log('ℹ️  No published posts to index');
    return;
  }

  // Add documents to the index
  const result = await index.addDocuments(publishedPosts, {
    primaryKey: 'id',
  });

  console.log(`✅ Indexed ${publishedPosts.length} posts. Task ID: ${result.taskUid}`);

  return result;
}

/**
 * Search posts using Meilisearch
 * @param query Search query string
 * @param options Search options (filters, limit, etc.)
 */
export async function searchPosts(
  query: string,
  options?: {
    limit?: number;
    offset?: number;
    filter?: string;
  }
) {
  if (typeof window === 'undefined') {
    throw new Error('Use this function only on the client side');
  }

  const client = getMeiliSearchClient();
  const index = client.index(POSTS_INDEX);

  const results = await index.search(query, {
    limit: options?.limit || 10,
    offset: options?.offset || 0,
    filter: options?.filter,
  });

  return results;
}

/**
 * Delete all documents from the index
 * Use with caution - typically only for reindexing
 */
export async function clearSearchIndex() {
  if (!meiliAdminClient) {
    throw new Error('Meilisearch admin client is only available on the server');
  }

  const index = meiliAdminClient.index(POSTS_INDEX);
  await index.deleteAllDocuments();

  console.log('✅ Cleared all documents from search index');
}
