'use client';

import { ErrorFallback } from '@/components/ErrorFallback';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorFallback actionLabel="Try Again" message={error.message} onAction={reset} />;
}
