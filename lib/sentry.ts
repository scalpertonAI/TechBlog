/**
 * Sentry utilities for error tracking and monitoring
 * Provides helper functions for error reporting
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Capture an exception and send it to Sentry
 *
 * @param error - The error to capture
 * @param context - Additional context about the error
 */
export function captureException(
  error: Error | unknown,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  }
) {
  Sentry.captureException(error, {
    tags: context?.tags,
    extra: context?.extra,
    level: context?.level || 'error',
  });
}

/**
 * Capture a message and send it to Sentry
 *
 * @param message - The message to capture
 * @param level - Severity level
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'info'
) {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 *
 * @param user - User information
 */
export function setUser(user: { id: string; email?: string; username?: string } | null) {
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 *
 * @param breadcrumb - Breadcrumb information
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  data?: Record<string, unknown>;
}) {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Wrap an async function with error handling
 * Automatically captures and reports errors to Sentry
 *
 * @param fn - The async function to wrap
 * @param errorMessage - Optional custom error message
 */
export function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> {
  return fn().catch((error) => {
    console.error(errorMessage || 'An error occurred:', error);
    captureException(error, {
      extra: { customMessage: errorMessage },
    });
    return null;
  });
}

/**
 * Initialize Sentry (if not already initialized by auto-instrumentation)
 * This is useful for additional configuration
 */
export function initSentry() {
  if (process.env.SENTRY_DSN) {
    // Set additional context or tags here if needed
    Sentry.setTag('environment', process.env.NODE_ENV || 'development');
  }
}
