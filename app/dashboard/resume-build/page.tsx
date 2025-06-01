'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { useUser } from '@stackframe/stack';
import CreateResumeDialog from '@/components/CreateResumeDialog';
import ResumeCard from '@/components/ResumeCard';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const user = useUser();
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      setLoading(true);

      // Fetch user plan
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        setPlan('Free'); // fallback to Free if error
        setLoading(false);
        return;
      }

      setPlan(profile.plan);

      // If plan is not Free, fetch resumes
      if (profile.plan !== 'Free') {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (!error) setResumes(data || []);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
      </div>
    );
  }

  if (plan === 'Free') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <Button onClick={() => router.push('/dashboard/pricing')} className="mb-6">
          Upgrade Plan
        </Button>
        <h2 className="text-2xl font-bold mb-4">You're on the Free Plan</h2>
        <p className="text-gray-600 mb-2">
          Upgrade your plan to unlock the Resume Builder and create professional resumes.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Your Resumes</h1>
        <CreateResumeDialog />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="border border-dashed border-black rounded-lg flex items-center justify-center text-center min-h-[200px]">
          <CreateResumeDialog asCard />
        </div>

        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
      </div>
    </div>
  );
}
