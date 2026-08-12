'use client';

import { useRouter } from 'next/navigation';
import { ErrorFallback } from '@/components/ErrorFallback';

export default function NotFoundPage() {
  const router = useRouter();

  return <ErrorFallback message="That page or egg could not be found." onAction={() => router.push('/')} title="Not Found" />;
}
