"use client";

import supabase from "@/lib/supabase";
import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import { useRouter } from "next/navigation";
import { getFeedbackByInterviewId, getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";

export default async function Dashboard() {
  const user = useUser();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Record<string, any>>({});

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user!.id),
    await getLatestInterviews({userId: user!.id})
  ]);
  const hasPastInterviews = userInterviews!.length > 0;
  const hasUpcomingInterviews = latestInterviews!.length > 0;

  useEffect(() => {
    const syncUser = async () => {
      if (!user?.primaryEmail) return;
      const userCacheKey = `userExists:${user.id}`;
      if (localStorage.getItem(userCacheKey) === "true") return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.primaryEmail)
        .maybeSingle();

      if (!data) {
        await supabase.from("users").insert([
          {
            id: user.id,
            email: user.primaryEmail,
            name: user.displayName || null,
            image: user.profileImageUrl || null,
          },
        ]);
      }

      localStorage.setItem(userCacheKey, "true");
    };

    syncUser();
  }, [user]);

  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      if (!user?.id) return;
      const allFeedbacks: Record<string, any> = {};

      for (const interview of dummyInterviews) {
        const feedback = await getFeedbackByInterviewId({
          interviewId: interview.id,
          userId: user.id,
        });
        allFeedbacks[interview.id] = feedback;
      }

      setFeedbacks(allFeedbacks);
    };

    fetchAllFeedbacks();
  }, [user]);

  const goToIntGen = () => {
    router.push("/dashboard/interview");
  };

  return (
    <div>
      {/* Your Interviews */}
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Interviews</h2>
          <Button onClick={goToIntGen}>Create an interview</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          {user?.id ? (
            hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interviewId={interview.id}
                  {...interview}
                  userId={user.id}
                  feedback={feedbacks[interview.id] || null}
                />
              ))
            ) : (
              <p>No past interviews.</p>
            )
          ) : (
            <p>Loading...</p>
          )}

        </div>
      </div>

      {/* Take Interviews */}
      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-2xl font-semibold">Take Interviews</h2>
        <div className="flex flex-wrap gap-4">
          {user?.id ? (
            // Only render when userId is available
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interviewId={interview.id}
                  {...interview}
                  userId={user.id}
                  feedback={feedbacks[interview.id] || null}
                />
              ))
            ) : (
              <p>No past interviews.</p>
            )
          ) : (
            <p>Loading...</p> // Or an appropriate message if userId is undefined
          )}
        </div>
      </div>
    </div>

  );
}
