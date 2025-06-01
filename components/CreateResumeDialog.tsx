'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { useUser } from '@stackframe/stack';

export default function CreateResumeDialog({ asCard = false }: { asCard?: boolean }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const user = useUser();

  const createResume = async () => {
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        title,
        user_id: user?.id,
      })
      .select()
      .single();

      const { data: profileData, error: fetchExpError } = await supabase
            .from("profiles")
            .select("experience")
            .eq("id", user?.id)
            .single();
      
          if (fetchExpError) {
            console.error("Failed to fetch latest experience:", fetchExpError);
            return;
          }
      
          const newExperience = (profileData?.experience ?? 0) + 10;
      
          const { error: experror } = await supabase
            .from("profiles")
            .update({ experience: newExperience })
            .eq("id", user?.id);
      
          if (experror) {
            console.error("Failed to update experience:", experror);
            return;
          }

    if (!error && data?.id) {
      setOpen(false);
      router.push(`/dashboard/resume-build/${data.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {asCard ? (
          <div className="text-center cursor-pointer bg-blue-500/20 rounded-lg w-full h-full flex items-center justify-center">
            <span className="text-black font-semibold">+ Create New Resume</span>
          </div>
        ) : (
          <Button>Create New Resume</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-xl font-semibold mb-4">Create New Resume</h2>
        <label className="block mb-2 text-sm font-medium">Resume Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Software Engineer Resume" />
        <div className="mt-4">
          <Button onClick={createResume} disabled={!title.trim()} className='w-full'>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
