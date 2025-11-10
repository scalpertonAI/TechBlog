# Troubleshooting Guide

## Common Issues and Solutions

### 1. `@effect-ts/system` Module Not Found Error

**Error:**
```
Error: Cannot find module '@effect-ts/system/_mjs/Tracing/Enable/index.mjs'
```

**Solution:**
This is already fixed in the latest version. If you still encounter this:

1. **Delete node_modules and lock files:**
```bash
rm -rf node_modules package-lock.json
# On Windows: rmdir /s /q node_modules && del package-lock.json
```

2. **Clear npm cache:**
```bash
npm cache clean --force
```

3. **Reinstall dependencies:**
```bash
npm install
```

4. **If using Node.js < 22, upgrade to Node 22+:**
```bash
node --version  # Should be >= 22.0.0
```

**Why this happens:**
The `@effect-ts` packages used by Contentlayer have ESM module resolution issues. We've pinned to stable versions and added overrides to fix this.

---

### 2. Contentlayer Build Errors

**Error:**
```
Contentlayer config change detected. Updating type definitions...
Error: ...
```

**Solution:**

1. **Clear Contentlayer cache:**
```bash
rm -rf .contentlayer
npx contentlayer build
```

2. **Check your MDX files have valid frontmatter:**
```mdx
---
title: 'Your Title'
description: 'Description'
date: '2024-01-15'
published: true
tags: ['tag1']
---
```

3. **Ensure all required fields are present:**
- `title` (required)
- `description` (required)
- `date` (required)
- `published` (required)

---

### 3. TypeScript Errors

**Error:**
```
Cannot find module 'contentlayer/generated'
```

**Solution:**

1. **Build contentlayer first:**
```bash
npx contentlayer build
```

2. **Restart your IDE/editor** to pick up new types

3. **Check tsconfig.json includes the path:**
```json
{
  "compilerOptions": {
    "paths": {
      "contentlayer/generated": ["./.contentlayer/generated"]
    }
  }
}
```

---

### 4. Next.js Build Fails

**Error:**
```
Module not found: Can't resolve 'contentlayer/generated'
```

**Solution:**

1. **Run build with contentlayer:**
```bash
npm run build
# This runs: contentlayer build && next build
```

2. **Check `.contentlayer` directory exists:**
```bash
ls -la .contentlayer
```

3. **Try sequential build:**
```bash
npx contentlayer build
npx next build
```

---

### 5. Images Not Loading

**Problem:** Hero images show broken image icons

**Solution:**

1. **Check image URLs are accessible:**
```bash
curl -I https://your-image-url.com/image.jpg
```

2. **Add domain to next.config.js:**
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-domain.com',
    },
  ],
}
```

3. **Use Unsplash for testing:**
```
https://images.unsplash.com/photo-...?w=1200&h=630&fit=crop
```

---

### 6. Search Not Working

**Problem:** Search returns no results or errors

**Solutions:**

**If using Meilisearch:**

1. **Check Meilisearch is running:**
```bash
curl http://localhost:7700/health
```

2. **Verify environment variables:**
```bash
echo $MEILI_HOST
echo $MEILI_MASTER_KEY
```

3. **Index your posts:**
```bash
npm run index-search
```

4. **Check index exists:**
```bash
curl -X GET 'http://localhost:7700/indexes' \
  -H "Authorization: Bearer YOUR_MASTER_KEY"
```

**Using fallback search:**
The app includes a fallback in-memory search if Meilisearch is unavailable. It should work automatically.

---

### 7. Newsletter Subscription Fails

**Error:** "Failed to subscribe" or API errors

**Solution:**

1. **Verify Beehiiv credentials:**
```bash
curl -X GET 'https://api.beehiiv.com/v2/publications' \
  -H "Authorization: Bearer YOUR_API_KEY"
```

2. **Check environment variables are set:**
```bash
# .env
BEEHIIV_API_KEY=your_key_here
BEEHIIV_PUBLICATION_ID=your_pub_id_here
```

3. **Test the API route:**
```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

4. **Check API quota:** Log in to Beehiiv and check you haven't hit rate limits

---

### 8. Sentry Not Tracking Errors

**Problem:** Errors not appearing in Sentry dashboard

**Solution:**

1. **Verify DSN is set:**
```bash
echo $SENTRY_DSN
```

2. **Test error tracking:**
Visit `http://localhost:3000/test-error` and click buttons

3. **Check Sentry is initialized:**
Look for Sentry initialization logs in console

4. **Verify project settings:**
- Check DSN is correct in Sentry dashboard
- Ensure project is not paused
- Check rate limits

---

### 9. Plausible Analytics Not Working

**Problem:** No page views in Plausible dashboard

**Solution:**

1. **Check script is loaded:**
Open browser DevTools → Network tab → Filter for "plausible"

2. **Verify domain matches:**
```bash
echo $NEXT_PUBLIC_PLAUSIBLE_DOMAIN
# Should match your deployed domain exactly
```

3. **Check ad blocker:**
Disable ad blockers as they often block analytics scripts

4. **Test in production:**
Plausible typically only tracks on production domains, not localhost

---

### 10. Tailwind Styles Not Working

**Problem:** Styles not applying or missing

**Solution:**

1. **Check globals.css is imported:**
Verify `app/layout.tsx` imports `@/styles/globals.css`

2. **Rebuild:**
```bash
rm -rf .next
npm run dev
```

3. **Check Tailwind config:**
Ensure `tailwind.config.ts` includes all content paths:
```typescript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
]
```

---

### 11. Port Already in Use

**Error:**
```
Port 3000 is already in use
```

**Solution:**

1. **Find and kill process:**
```bash
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. **Use different port:**
```bash
PORT=3001 npm run dev
```

---

### 12. ESLint Errors

**Error:** Various linting errors

**Solution:**

1. **Auto-fix fixable issues:**
```bash
npm run lint -- --fix
```

2. **Format code:**
```bash
npm run format
```

3. **Temporarily disable:**
Add to `.eslintrc.json` rules if needed:
```json
{
  "rules": {
    "rule-name": "off"
  }
}
```

---

## Environment Variables Checklist

Make sure you have these set in `.env`:

**Required for basic functionality:**
- ✅ `SITE_URL`
- ✅ `NODE_ENV`

**Optional but recommended:**
- ⚙️ `BEEHIIV_API_KEY`
- ⚙️ `BEEHIIV_PUBLICATION_ID`
- ⚙️ `MEILI_HOST`
- ⚙️ `MEILI_MASTER_KEY`
- ⚙️ `NEXT_PUBLIC_MEILI_SEARCH_KEY`
- ⚙️ `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- ⚙️ `SENTRY_DSN`
- ⚙️ `REINDEX_SECRET`

---

## Getting Help

If you're still stuck:

1. **Check the README.md** for detailed setup instructions
2. **Search existing issues** on GitHub
3. **Create a new issue** with:
   - Error message
   - Steps to reproduce
   - Your environment (Node version, OS, etc.)
   - What you've already tried

---

## Clean Install

If all else fails, start fresh:

```bash
# 1. Backup your content
cp -r content content.backup

# 2. Delete everything
rm -rf node_modules .next .contentlayer package-lock.json

# 3. Reinstall
npm install

# 4. Build contentlayer
npx contentlayer build

# 5. Try dev server
npm run dev
```

---

## Useful Debug Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Check for outdated packages
npm outdated

# Verify TypeScript compilation
npm run type-check

# Test build locally
npm run build
npm start
```

---

**Last Updated:** Based on Node 22+ and Next.js 15
