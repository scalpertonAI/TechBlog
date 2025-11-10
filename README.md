# TechBlog

A production-ready, full-stack blog built with **Next.js 15**, **TypeScript**, **MDX**, **Tailwind CSS v4**, and modern web technologies.

## ✨ Features

- 🚀 **Next.js 15** with App Router and TypeScript
- 📝 **MDX** content with Contentlayer for type-safe authoring
- 🎨 **Tailwind CSS v4** for modern, utility-first styling
- 🔍 **Meilisearch** integration for lightning-fast search
- 📧 **Beehiiv** newsletter integration via API
- 📊 **Plausible Analytics** for privacy-friendly tracking
- 🐛 **Sentry** for error monitoring and performance tracking
- 🖼️ **Image Optimization** with next/image + Cloudinary/Imgix support
- 📱 **Fully Responsive** and accessible
- ⚡ **Optimized Performance** with SSG and ISR
- 🔐 **Security-first** with proper API route protection
- 🧪 **Testing** with Vitest
- 🚢 **CI/CD** with GitHub Actions
- 🐳 **Docker** support for containerized deployments

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Content Management](#-content-management)
- [Search Setup](#-search-setup)
- [Newsletter Setup](#-newsletter-setup)
- [Analytics & Monitoring](#-analytics--monitoring)
- [Deployment](#-deployment)
- [Scripts](#-scripts)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ (LTS)
- npm or yarn
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/techblog.git
cd techblog
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and configure your environment variables (see [Environment Variables](#-environment-variables)).

4. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Site Configuration
SITE_URL=http://localhost:3000
NODE_ENV=development

# Newsletter (Beehiiv)
BEEHIIV_API_KEY=your_beehiiv_api_key
BEEHIIV_PUBLICATION_ID=your_publication_id

# Search (Meilisearch)
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=your_meilisearch_master_key
NEXT_PUBLIC_MEILI_HOST=http://localhost:7700
NEXT_PUBLIC_MEILI_SEARCH_KEY=your_search_key

# Analytics (Plausible)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com

# Error Monitoring (Sentry)
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project
SENTRY_AUTH_TOKEN=your_auth_token

# Image Optimization (Optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
IMGIX_BASE_URL=https://your-source.imgix.net

# Security
REINDEX_SECRET=generate_a_random_secret_here

# Optional: ISR Revalidation Time (seconds)
REVALIDATE_TIME=60
```

### Getting API Keys

- **Beehiiv**: Sign up at [beehiiv.com](https://www.beehiiv.com) and get your API key from Settings > API
- **Meilisearch**: Run locally with `docker run -p 7700:7700 getmeili/meilisearch` or use [Meilisearch Cloud](https://www.meilisearch.com/cloud)
- **Plausible**: Self-host or use [Plausible Analytics](https://plausible.io)
- **Sentry**: Sign up at [sentry.io](https://sentry.io) and create a new project
- **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com) for image optimization

## 📁 Project Structure

```
techblog/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── blog/              # Blog routes
│   │   ├── page.tsx       # Blog listing
│   │   └── [slug]/        # Dynamic post pages
│   ├── api/               # API routes
│   │   ├── subscribe/     # Newsletter subscription
│   │   ├── search/        # Search endpoint
│   │   ├── reindex/       # Meilisearch reindexing
│   │   └── og/            # OG image generation
│   ├── rss.xml/           # RSS feed
│   └── sitemap.xml/       # Sitemap
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   ├── SearchBar.tsx
│   ├── SubscribeForm.tsx
│   ├── Pagination.tsx
│   ├── SEO.tsx
│   └── MDXComponents.tsx
├── content/               # MDX content
│   └── posts/            # Blog posts
├── lib/                   # Utility functions
│   ├── utils.ts
│   ├── meilisearch.ts
│   ├── beehiiv.ts
│   ├── analytics.ts
│   └── sentry.ts
├── scripts/               # Utility scripts
│   ├── new-post.ts       # Generate new post
│   └── index-meili.ts    # Index posts in Meilisearch
├── styles/
│   └── globals.css       # Global styles
├── tests/                 # Test files
├── public/               # Static assets
├── .github/
│   └── workflows/        # CI/CD workflows
├── contentlayer.config.ts # Contentlayer configuration
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
└── package.json
```

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build           # Build for production
npm start               # Start production server

# Content
npm run new-post        # Create a new blog post
npm run index-search    # Index posts in Meilisearch

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run type-check      # TypeScript type checking

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
```

### Development Workflow

1. **Create a new post**

```bash
npm run new-post
```

Follow the prompts to create a new MDX file in `content/posts/`.

2. **Edit the post**

Edit the generated MDX file. The dev server will hot-reload changes.

3. **Preview locally**

Visit `http://localhost:3000/blog` to see your new post.

4. **Build and test**

```bash
npm run build
npm start
```

## 📝 Content Management

### Creating Posts

Posts are written in MDX format with frontmatter:

```mdx
---
title: 'Your Post Title'
description: 'A brief description'
date: '2024-01-15'
published: true
featured: false
tags: ['Next.js', 'TypeScript']
authors: ['Your Name']
heroImage: 'https://example.com/image.jpg'
---

Your content here...
```

### MDX Components

Use custom components in your posts:

```mdx
<Callout type="info">
This is an info callout!
</Callout>

<YouTube id="dQw4w9WgXcQ" />

<Tweet id="1234567890" />
```

### Frontmatter Fields

- `title` (required): Post title
- `description` (required): SEO description
- `date` (required): Publish date (YYYY-MM-DD)
- `published` (required): Visibility flag
- `featured` (optional): Show in featured section
- `tags` (optional): Array of tags
- `authors` (optional): Array of author names
- `heroImage` (optional): Hero image URL

## 🔍 Search Setup

### Local Development

1. **Start Meilisearch**

```bash
docker run -p 7700:7700 \
  -e MEILI_MASTER_KEY="your_master_key" \
  getmeili/meilisearch:latest
```

2. **Index your posts**

```bash
npm run index-search
```

3. **Test search**

Visit your site and use the search bar.

### Production

For production, use [Meilisearch Cloud](https://www.meilisearch.com/cloud) or self-host:

1. Set `MEILI_HOST` to your production URL
2. Set `MEILI_MASTER_KEY` and `NEXT_PUBLIC_MEILI_SEARCH_KEY`
3. Run indexing via the reindex API:

```bash
curl -X POST https://yourdomain.com/api/reindex \
  -H "x-reindex-secret: your_secret"
```

## 📧 Newsletter Setup

### Beehiiv Configuration

1. **Create a Beehiiv account** at [beehiiv.com](https://www.beehiiv.com)

2. **Get your API credentials**
   - Go to Settings > API
   - Copy your API key and Publication ID

3. **Set environment variables**

```bash
BEEHIIV_API_KEY=your_api_key
BEEHIIV_PUBLICATION_ID=your_publication_id
```

4. **Configure double opt-in** (optional)
   - In Beehiiv dashboard, go to Settings > Email
   - Enable "Double opt-in"

### Testing Newsletter

Use the subscribe form in the footer or create a test:

```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 📊 Analytics & Monitoring

### Plausible Analytics

1. **Self-hosted or Cloud**
   - Cloud: Sign up at [plausible.io](https://plausible.io)
   - Self-hosted: Follow [installation guide](https://plausible.io/docs/self-hosting)

2. **Add your domain**

```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

3. **Verify installation**
   - Visit your site
   - Check Plausible dashboard for page views

### Sentry Error Monitoring

1. **Create a Sentry project** at [sentry.io](https://sentry.io)

2. **Configure environment variables**

```bash
SENTRY_DSN=your_dsn
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project
```

3. **Test error tracking**
   - Visit `/test-error` in your browser
   - Trigger a test error
   - Check Sentry dashboard

**⚠️ Important**: Remove or protect `/test-error` in production!

## 🚢 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Set environment variables**
   - Go to Vercel dashboard
   - Settings > Environment Variables
   - Add all variables from `.env.example`

4. **Configure domains**
   - Settings > Domains
   - Add your custom domain

5. **Post-deployment**

Index your posts:

```bash
curl -X POST https://yourdomain.com/api/reindex \
  -H "x-reindex-secret: your_secret"
```

### Docker Deployment

1. **Build image**

```bash
docker build -t techblog .
```

2. **Run container**

```bash
docker run -p 3000:3000 \
  --env-file .env \
  techblog
```

3. **Docker Compose** (optional)

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    env_file:
      - .env
    restart: unless-stopped
```

### Other Platforms

- **Netlify**: Use the Netlify CLI or Git integration
- **Railway**: Connect your GitHub repo
- **AWS/GCP/Azure**: Use Docker image or Next.js build

## 📜 Scripts

### `npm run new-post`

Interactive CLI to create a new blog post.

```bash
npm run new-post

# Prompts for:
# - Title
# - Description
# - Tags
# - Author
# - Featured status
# - Hero image
```

### `npm run index-search`

Index all published posts in Meilisearch.

```bash
npm run index-search

# Requires:
# - MEILI_HOST
# - MEILI_MASTER_KEY
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

### Writing Tests

Tests use Vitest. Example:

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('formats dates correctly', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
  });
});
```

## 🔧 Troubleshooting

### Build Errors

**Contentlayer errors**

```bash
# Clear cache and rebuild
rm -rf .contentlayer .next
npx contentlayer build
npm run build
```

**Type errors**

```bash
# Check types
npm run type-check
```

### Runtime Issues

**Search not working**

- Verify Meilisearch is running
- Check `MEILI_HOST` and `MEILI_MASTER_KEY`
- Run `npm run index-search`

**Newsletter errors**

- Verify Beehiiv API credentials
- Check API quota limits
- Test with curl command

**Images not loading**

- Check image URLs are accessible
- Configure `next.config.js` remote patterns
- For Cloudinary, verify cloud name

### Performance

**Slow builds**

- Use `npm run build` with Node 22+
- Enable SWC minification
- Check Contentlayer performance

**Slow page loads**

- Enable ISR with `revalidate`
- Optimize images with `next/image`
- Check bundle size with `npm run build`

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org)
- [Contentlayer](https://contentlayer.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Meilisearch](https://www.meilisearch.com)
- [Beehiiv](https://www.beehiiv.com)
- [Plausible](https://plausible.io)
- [Sentry](https://sentry.io)

## 📞 Support

- 📧 Email: support@yourdomain.com
- 🐦 Twitter: [@yourusername](https://twitter.com/yourusername)
- 💬 Discord: [Join our server](https://discord.gg/yourinvite)

---

**Ready to blog?** Start with `npm run dev` and create your first post with `npm run new-post`!

