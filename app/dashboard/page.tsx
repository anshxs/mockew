"use client";

import { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { dummyInterviews } from "@/constants";
import supabase from "@/lib/supabase";
import {
  getFeedbackByInterviewId,
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

export default function Dashboard() {
  const user = useUser();
  const router = useRouter();

  const [feedbacks, setFeedbacks] = useState<Record<string, any>>({});
  const [userInterviews, setUserInterviews] = useState<Interview[]>([]);
const [latestInterviews, setLatestInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      if (!user?.primaryEmail) return;
      const userCacheKey = `userExists:${user.id}`;
      if (localStorage.getItem(userCacheKey) === "true") return;

      const { data } = await supabase
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
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);

      const [interviews, latest] = await Promise.all([
        getInterviewsByUserId(user.id),
        getLatestInterviews({ userId: user.id }),
      ]);

      setUserInterviews(interviews || []);
      setLatestInterviews(latest || []);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!user?.id) return;
  
      const { data: feedbackData, error } = await supabase
        .from("feedbacks")
        .select("*")
        .eq("user_id", user.id);
  
      if (error) {
        console.error("Error fetching feedbacks:", error);
        return;
      }
  
      // Transform the feedback array into an object with interviewId as key
      const feedbackMap: Record<string, any> = {};
      feedbackData?.forEach((feedback) => {
        feedbackMap[feedback.interview_id] = feedback;
      });
  
      setFeedbacks(feedbackMap);
    };
  
    fetchFeedbacks();
  }, [user]);
  

  const goToIntGen = () => {
    router.push("/dashboard/interview");
  };

  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviews = latestInterviews.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Interviews</h2>
          <Button onClick={goToIntGen}>Create an interview</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                {...interview}
                userId={user!.id}
                feedback={feedbacks[interview.id] || null}
              />
            ))
          ) : (
            <p>No past interviews.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-2xl font-semibold">Take Interviews</h2>
        <div className="flex flex-wrap gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : hasUpcomingInterviews ? (
            latestInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                {...interview}
                userId={user!.id}
                feedback={feedbacks[interview.id] || null}
              />
            ))
          ) : (
            <p>No upcoming interviews.</p>
          )}
        </div>
      </div>
    </div>
  );
}
