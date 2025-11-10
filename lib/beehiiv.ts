/**
 * Beehiiv API Integration
 * Documentation: https://developers.beehiiv.com/docs/v2/
 *
 * This module handles newsletter subscriptions via the Beehiiv API.
 * Always use server-side to keep API keys secure.
 */

const BEEHIIV_API_BASE = 'https://api.beehiiv.com/v2';

/**
 * Beehiiv subscriber response type
 */
export interface BeehiivSubscriber {
  id: string;
  email: string;
  status: 'active' | 'pending' | 'unsubscribed';
  created: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referring_site?: string;
}

/**
 * Subscribe a user to the Beehiiv newsletter
 *
 * @param email - User's email address
 * @param options - Additional subscription options
 * @returns Beehiiv subscriber object
 *
 * Note: Beehiiv supports double opt-in. Check your publication settings.
 */
export async function subscribeToNewsletter(
  email: string,
  options?: {
    reactivateExisting?: boolean;
    sendWelcomeEmail?: boolean;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    referringSite?: string;
  }
): Promise<{ success: boolean; data?: BeehiivSubscriber; error?: string }> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error('Beehiiv API credentials not configured');
    return {
      success: false,
      error: 'Newsletter service not configured',
    };
  }

  try {
    const response = await fetch(
      `${BEEHIIV_API_BASE}/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: options?.reactivateExisting ?? false,
          send_welcome_email: options?.sendWelcomeEmail ?? true,
          utm_source: options?.utmSource,
          utm_medium: options?.utmMedium,
          utm_campaign: options?.utmCampaign,
          referring_site: options?.referringSite,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Beehiiv API error:', errorData);

      // Handle specific error cases
      if (response.status === 400) {
        return {
          success: false,
          error: errorData.message || 'Invalid email address',
        };
      }

      if (response.status === 409) {
        return {
          success: false,
          error: 'This email is already subscribed',
        };
      }

      return {
        success: false,
        error: 'Failed to subscribe. Please try again later.',
      };
    }

    const data = await response.json();

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Get subscriber information by email
 *
 * @param email - Subscriber's email address
 * @returns Subscriber data or null if not found
 */
export async function getSubscriber(
  email: string
): Promise<{ success: boolean; data?: BeehiivSubscriber; error?: string }> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    return {
      success: false,
      error: 'Newsletter service not configured',
    };
  }

  try {
    const response = await fetch(
      `${BEEHIIV_API_BASE}/publications/${publicationId}/subscriptions?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to fetch subscriber',
      };
    }

    const data = await response.json();

    return {
      success: true,
      data: data.data?.[0] || null,
    };
  } catch (error) {
    console.error('Error fetching subscriber:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Unsubscribe a user from the newsletter
 *
 * @param email - User's email address
 * @returns Success status
 */
export async function unsubscribeFromNewsletter(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    return {
      success: false,
      error: 'Newsletter service not configured',
    };
  }

  try {
    // First, get the subscriber ID
    const subscriber = await getSubscriber(email);

    if (!subscriber.success || !subscriber.data) {
      return {
        success: false,
        error: 'Subscriber not found',
      };
    }

    const response = await fetch(
      `${BEEHIIV_API_BASE}/publications/${publicationId}/subscriptions/${subscriber.data.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to unsubscribe',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
