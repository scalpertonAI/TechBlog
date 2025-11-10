'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

/**
 * Test Error Page
 * Used for testing Sentry error tracking integration
 *
 * This page should be removed or protected in production
 */
export default function TestErrorPage() {
  const [errorThrown, setErrorThrown] = useState(false);

  const throwError = () => {
    setErrorThrown(true);
    throw new Error('Test error from TechBlog - Sentry integration test');
  };

  const captureMessage = () => {
    Sentry.captureMessage('Test message from TechBlog', 'info');
    alert('Message sent to Sentry! Check your Sentry dashboard.');
  };

  const captureException = () => {
    try {
      throw new Error('Test exception captured manually');
    } catch (error) {
      Sentry.captureException(error);
      alert('Exception sent to Sentry! Check your Sentry dashboard.');
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="rounded-lg border border-border bg-card p-8">
        <h1 className="mb-4 text-3xl font-bold">Sentry Error Testing</h1>
        <p className="mb-6 text-muted-foreground">
          This page helps test Sentry error monitoring integration. Use these buttons to
          trigger different types of errors.
        </p>

        <div className="space-y-4">
          <div>
            <button
              onClick={throwError}
              className="rounded-md bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90"
            >
              Throw Uncaught Error
            </button>
            <p className="mt-2 text-sm text-muted-foreground">
              Throws an unhandled error that will be caught by Sentry's error boundary
            </p>
          </div>

          <div>
            <button
              onClick={captureMessage}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Send Test Message
            </button>
            <p className="mt-2 text-sm text-muted-foreground">
              Sends a test message to Sentry without throwing an error
            </p>
          </div>

          <div>
            <button
              onClick={captureException}
              className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
            >
              Capture Exception
            </button>
            <p className="mt-2 text-sm text-muted-foreground">
              Captures and reports an exception to Sentry manually
            </p>
          </div>
        </div>

        {errorThrown && (
          <div className="mt-6 rounded-md bg-destructive/10 p-4 text-destructive">
            Error was thrown! Check your Sentry dashboard.
          </div>
        )}

        <div className="mt-8 rounded-md bg-muted p-4">
          <h2 className="mb-2 font-semibold">Configuration Status</h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              Sentry DSN: {process.env.NEXT_PUBLIC_SENTRY_DSN ? '✅ Configured' : '❌ Not configured'}
            </li>
            <li>Environment: {process.env.NODE_ENV}</li>
          </ul>
        </div>

        <div className="mt-6 rounded-md border border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-950">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Warning:</strong> Remove or protect this page before deploying to
            production!
          </p>
        </div>
      </div>
    </div>
  );
}
