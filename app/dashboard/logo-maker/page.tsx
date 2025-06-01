"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

import SideNav from "./SideNav";
import { IconController } from "./IconController";
import { BackgroundController } from "./BackgroundController";
import { LogoPreview } from "./LogoPreview";
import { UpdateStorageContext } from "./UpdateStorageContext";
import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";

function LogoMaker() {
  const user = useUser();
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [updateStorage, setUpdateStorage] = useState({});
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching plan:", error);
      } else {
        setPlan(data.plan);
      }

      setLoading(false);
    };

    fetchUserPlan();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  if (plan === "Free") {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div>
          <Button className=" mb-4" onClick={() => window.location.href = "/pricing"}>
            Upgrade Plan
          </Button>
          <h2 className="text-2xl font-semibold mb-2">Free Plan Access</h2>
          <p className="text-muted-foreground">
            You're currently on the Free Plan. Upgrade to unlock the Logo Maker tool.
          </p>
          
        </div>
      </div>
    );
  }

  return (
    <UpdateStorageContext.Provider value={{ updateStorage, setUpdateStorage }}>
      <div className="w-64 mt-5 fixed">
        <SideNav selectedIndex={(value) => setSelectedIndex(value)} />
      </div>
      <div className="ml-64 p-4 grid grid-cols-1 md:grid-cols-8 gap-6">
        <div className="md:col-span-3 border h-screen rounded-lg p-6 overflow-auto">
          {selectedIndex === 1 ? <IconController /> : <BackgroundController />}
        </div>
        <div className="md:col-span-5 border h-screen rounded-lg p-6 overflow-auto">
          <LogoPreview />
        </div>
      </div>
    </UpdateStorageContext.Provider>
  );
}

export default LogoMaker;
