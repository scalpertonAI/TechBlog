/**
 * Analytics utilities for Plausible
 * Plausible is a privacy-friendly, open-source analytics platform
 *
 * Documentation: https://plausible.io/docs
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: {
        callback?: () => void;
        props?: Record<string, string | number | boolean>;
      }
    ) => void;
  }
}

/**
 * Track a custom event in Plausible
 *
 * @param eventName - Name of the event (e.g., "Newsletter Signup")
 * @param props - Optional event properties
 *
 * Example:
 * trackEvent("Newsletter Signup", { source: "footer" })
 */
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.plausible) {
    window.plausible(eventName, { props });
  } else {
    // Fallback if Plausible hasn't loaded yet
    console.log('Plausible not loaded, event:', eventName, props);
  }
}

/**
 * Track a page view (usually handled automatically by Plausible)
 * Use this for custom page view tracking (e.g., in SPAs)
 *
 * @param url - Optional URL to track (defaults to current URL)
 */
export function trackPageView(url?: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const pageUrl = url || window.location.pathname + window.location.search;

  if (window.plausible) {
    window.plausible('pageview', {
      props: { url: pageUrl },
    });
  }
}

/**
 * Get the Plausible script tag for injection into the page
 * This is used in the root layout
 *
 * @returns Script element props for Next.js Script component
 */
export function getPlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  if (!domain) {
    return null;
  }

  return {
    src: 'https://plausible.io/js/script.js',
    'data-domain': domain,
    defer: true,
  };
}

/**
 * Custom events for the blog
 * Define all your custom events here for better type safety
 */
export const AnalyticsEvents = {
  // Newsletter events
  NEWSLETTER_SUBSCRIBE: 'Newsletter Subscribe',
  NEWSLETTER_ERROR: 'Newsletter Error',

  // Search events
  SEARCH_QUERY: 'Search Query',
  SEARCH_RESULT_CLICK: 'Search Result Click',

  // Content events
  POST_VIEW: 'Post View',
  POST_SHARE: 'Post Share',
  EXTERNAL_LINK_CLICK: 'External Link Click',

  // Engagement events
  COPY_CODE_BLOCK: 'Copy Code Block',
  DOWNLOAD_RESOURCE: 'Download Resource',
} as const;

/**
 * Helper function to track newsletter subscription
 */
export function trackNewsletterSubscribe(source: string) {
  trackEvent(AnalyticsEvents.NEWSLETTER_SUBSCRIBE, { source });
}

/**
 * Helper function to track search queries
 */
export function trackSearch(query: string, resultsCount: number) {
  trackEvent(AnalyticsEvents.SEARCH_QUERY, {
    query,
    results: resultsCount,
  });
}

/**
 * Helper function to track post views
 */
export function trackPostView(slug: string, title: string) {
  trackEvent(AnalyticsEvents.POST_VIEW, {
    slug,
    title,
  });
}
