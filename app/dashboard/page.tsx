"use client";

import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { Loader2 } from "lucide-react";
import supabase from "@/lib/supabase";

export default function Dashboard() {
  const user = useUser();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);

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

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("credits")
        .eq("id", user.id)
        .maybeSingle();

      if (userError) {
        console.error("Error fetching credits:", userError);
      } else {
        setCredits(userData?.credits || 0);
      }

      const { data: interviews, error: interviewError } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const { data: latest, error: latestError } = await supabase
        .from("interviews")
        .select("*")
        .neq("user_id", user.id)
        .eq("finalized", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (interviewError || latestError) {
        console.error(
          "Error fetching interviews:",
          interviewError || latestError
        );
      }

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
          <div className="flex items-center gap-2">
            {credits !== null && (
              <Button variant={"secondary"} onClick={()=>router.push('/dashboard/credits')} className="border-2">
                Credits:{" "}
                <span className="text-green-600 font-bold">{credits}</span>
              </Button>
            )}
            <Button onClick={goToIntGen}>Create an interview</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
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

      <div className="flex flex-col gap-4 mt-8 mb-12">
        <h2 className="text-2xl font-semibold">Take Interviews</h2>
        <div className="flex flex-wrap gap-4">
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
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
