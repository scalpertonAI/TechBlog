import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/beehiiv';
import { isValidEmail } from '@/lib/utils';
import { captureException } from '@/lib/sentry';

/**
 * Newsletter Subscription API Route
 * Handles newsletter subscriptions via Beehiiv API
 *
 * POST /api/subscribe
 * Body: { email: string, source?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'unknown' } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Subscribe via Beehiiv
    const result = await subscribeToNewsletter(email, {
      reactivateExisting: false,
      sendWelcomeEmail: true,
      utmSource: source,
      referringSite: request.headers.get('referer') || undefined,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message:
          result.data?.status === 'pending'
            ? 'Please check your email to confirm your subscription.'
            : 'Successfully subscribed to the newsletter!',
        data: result.data,
      });
    }

    // Handle subscription errors
    return NextResponse.json(
      {
        success: false,
        message: result.error || 'Failed to subscribe. Please try again.',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Subscription API error:', error);
    captureException(error, {
      tags: { api: 'subscribe' },
      extra: { endpoint: '/api/subscribe' },
    });

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
