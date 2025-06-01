'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUser } from '@stackframe/stack';

export default function RedirectPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      // Not logged in
      const timeout = setTimeout(() => {
        router.replace('/dashboard');
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (user && user.primaryEmail) {
      const username = user.primaryEmail.split('@')[0];
      const timeout = setTimeout(() => {
        router.replace(`/p/${username}`);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800">
      <Loader2 className="animate-spin w-8 h-8 mb-4 text-blue-500" />
      <p className="text-lg font-medium">
        {user === null && 'Redirecting to sign in...'}
        {user && user.primaryEmail && 'Redirecting to your profile...'}
        {!user && 'Checking authentication...'}
      </p>
    </div>
  );
}
