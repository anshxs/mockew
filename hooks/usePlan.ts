import supabase from "@/lib/supabase";
import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";

export const useUserPlan = () => {
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"Free" | "Paid" | "Sponsored" | null>(null);
  const [planExpiry, setPlanExpiry] = useState<Date | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user?.primaryEmail) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("plan, plan_expires_at")
        .eq("email", user.primaryEmail)
        .single();

      if (!error && data) {
        setPlan(data.plan);
        setPlanExpiry(data.plan_expires_at ? new Date(data.plan_expires_at) : null);
      }

      setLoading(false);
    };

    fetchPlan();
  }, [user]);

  return { user, plan, planExpiry, loading };
};
