#!/usr/bin/env tsx

/**
 * New Post Generator Script
 * Creates a new MDX blog post with frontmatter template
 *
 * Usage:
 *   npm run new-post
 *   or
 *   npx tsx scripts/new-post.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🚀 Create a new blog post\n');

  // Get post details
  const title = await question('Post title: ');
  if (!title.trim()) {
    console.error('❌ Title is required!');
    process.exit(1);
  }

  const description = await question('Description: ');
  if (!description.trim()) {
    console.error('❌ Description is required!');
    process.exit(1);
  }

  const tagsInput = await question('Tags (comma-separated): ');
  const tags = tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const author = await question('Author [Admin]: ') || 'Admin';

  const featuredInput = await question('Featured post? (y/N): ');
  const featured = featuredInput.toLowerCase() === 'y';

  const heroImage = await question('Hero image URL (optional): ');

  // Generate slug
  const slug = slugify(title);
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Create frontmatter
  const frontmatter = `---
title: '${title}'
description: '${description}'
date: '${date}'
published: true
featured: ${featured}
tags: [${tags.map((tag) => `'${tag}'`).join(', ')}]
authors: ['${author}']${heroImage ? `\nheroImage: '${heroImage}'` : ''}
---

# ${title}

${description}

## Introduction

Write your introduction here...

## Main Content

Add your main content here...

## Conclusion

Wrap up your post here...

---

*Published on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*
`;

  // Determine file path
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const fileName = `${slug}.mdx`;
  const filePath = path.join(postsDir, fileName);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    const overwrite = await question(`\n⚠️  File ${fileName} already exists. Overwrite? (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ Cancelled.');
      rl.close();
      process.exit(0);
    }
  }

  // Ensure posts directory exists
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(filePath, frontmatter);

  console.log(`\n✅ Successfully created new post!`);
  console.log(`📝 File: ${filePath}`);
  console.log(`🔗 Slug: ${slug}`);
  console.log(`\nYou can now edit the post at: content/posts/${fileName}`);

  rl.close();
}

main().catch((error) => {
  console.error('❌ Error:', error);
  rl.close();
  process.exit(1);
});
