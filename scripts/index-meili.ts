#!/usr/bin/env tsx

/**
 * Meilisearch Indexing Script
 * Indexes all blog posts into Meilisearch
 *
 * Usage:
 *   npm run index-search
 *   or
 *   npx tsx scripts/index-meili.ts
 *
 * Environment variables required:
 *   MEILI_HOST - Meilisearch host URL
 *   MEILI_MASTER_KEY - Meilisearch master key
 */

import { allPosts } from '../.contentlayer/generated/index.mjs';
import {
  indexPosts,
  configureSearchIndex,
  clearSearchIndex,
  type IndexedPost,
} from '../lib/meilisearch';

function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

async function main() {
  console.log('🔍 Meilisearch Indexing Script\n');

  // Check environment variables
  if (!process.env.MEILI_HOST || !process.env.MEILI_MASTER_KEY) {
    console.error('❌ Error: Missing required environment variables');
    console.error('   Required: MEILI_HOST, MEILI_MASTER_KEY');
    console.error('\n   Set them in your .env file or export them:');
    console.error('   export MEILI_HOST=http://localhost:7700');
    console.error('   export MEILI_MASTER_KEY=your_master_key');
    process.exit(1);
  }

  console.log(`📡 Connecting to Meilisearch at: ${process.env.MEILI_HOST}`);

  try {
    // Get all published posts
    const posts = allPosts.filter((post) => post.published);

    if (posts.length === 0) {
      console.log('⚠️  No published posts found to index.');
      return;
    }

    console.log(`📚 Found ${posts.length} published posts\n`);

    // Transform posts for indexing
    const indexedPosts: IndexedPost[] = posts.map((post) => {
      const indexedPost: IndexedPost = {
        id: post._id,
        title: post.title,
        description: post.description,
        content: truncate(post.body.raw, 500), // Index excerpt only
        tags: post.tags || [],
        url: post.url,
        date: new Date(post.date).getTime(),
        published: post.published,
      };

      console.log(`  ✓ ${post.title}`);
      return indexedPost;
    });

    console.log('\n⚙️  Configuring search index...');
    await configureSearchIndex();

    console.log('🗑️  Clearing existing index...');
    await clearSearchIndex();

    console.log('📤 Indexing posts...');
    const result = await indexPosts(indexedPosts);

    console.log('\n✅ Indexing complete!');
    console.log(`   Indexed: ${indexedPosts.length} posts`);
    console.log(`   Task ID: ${result?.taskUid || 'N/A'}`);
    console.log('\n💡 Tip: You can now search posts in your application');
  } catch (error) {
    console.error('\n❌ Indexing failed:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);

      // Provide helpful error messages
      if (error.message.includes('ECONNREFUSED')) {
        console.error('\n   → Make sure Meilisearch is running');
        console.error('   → Check MEILI_HOST is correct');
      } else if (error.message.includes('Unauthorized')) {
        console.error('\n   → Check MEILI_MASTER_KEY is correct');
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
