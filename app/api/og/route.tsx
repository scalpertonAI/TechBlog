import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

/**
 * Dynamic OG Image Generator
 * Generates Open Graph images for blog posts
 *
 * GET /api/og?title=...&description=...
 *
 * This is a fallback when Cloudinary/Imgix is not configured
 * For production, consider using Cloudinary transformations instead
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const title = searchParams.get('title') || 'TechBlog';
    const description = searchParams.get('description') || 'A modern blog built with Next.js';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0f172a',
            padding: '80px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(59, 130, 246, 0.1) 2%, transparent 0%)',
              backgroundSize: '100px 100px',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              zIndex: 1,
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                T
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                TechBlog
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '900px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </div>

            {/* Description */}
            {description && (
              <div
                style={{
                  fontSize: '28px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  maxWidth: '800px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {description}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '24px',
              zIndex: 1,
            }}
          >
            <span>Read on techblog.com</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
