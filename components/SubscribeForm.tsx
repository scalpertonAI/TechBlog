'use client';

import { useState } from 'react';
import { isValidEmail } from '@/lib/utils';
import { trackNewsletterSubscribe } from '@/lib/analytics';

/**
 * Newsletter Subscription Form
 * Integrates with Beehiiv API via our serverless function
 */
export default function SubscribeForm({ source = 'footer' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setStatus('loading');
    setMessage('');

    // Validate email
    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(
          data.message || 'Successfully subscribed! Please check your email to confirm.'
        );
        setEmail('');

        // Track successful subscription
        trackNewsletterSubscribe(source);
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={status === 'loading' || status === 'success'}
          required
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
        </button>
      </form>

      {/* Status Messages */}
      {message && (
        <div
          className={`mt-2 text-sm ${
            status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
}
