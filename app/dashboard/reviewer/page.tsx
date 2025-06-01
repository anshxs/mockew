"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Github } from "lucide-react";

import { ReviewClient } from "@/components/review-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";
import router from "next/router";

export default function Page() {
  const user = useUser();
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [repo, setRepo] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [dialogOpen, setDialogOpen] = useState(true);

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

  const fetchGitHubFiles = async () => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${username}/${repo}/git/trees/main?recursive=1`
      );
      const data = await res.json();

      if (!data.tree) throw new Error("Invalid repository or no access.");

      const filePaths = data.tree
        .filter((item: any) => item.type === "blob")
        .map((item: any) => item.path);

      setFiles(filePaths);
      setDialogOpen(false);
      const { data: profileData, error: fetchExpError } = await supabase
            .from("profiles")
            .select("experience")
            .eq("id", user?.id)
            .single();
      
          if (fetchExpError) {
            console.error("Failed to fetch latest experience:", fetchExpError);
            return;
          }
      
          const newExperience = (profileData?.experience ?? 0) + 2;
      
          const { error: experror } = await supabase
            .from("profiles")
            .update({ experience: newExperience })
            .eq("id", user?.id);
      
          if (experror) {
            console.error("Failed to update experience:", experror);
            return;
          }
    } catch (error) {
      console.error("Error fetching repo files:", error);
    }
  };

  const fetchFileContent = async (filePath: string) => {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${username}/${repo}/main/${filePath}`
      );
      const content = await res.text();
      setSelectedFileContent(content);
      setSelectedFile(filePath);
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      fetchFileContent(files[0]);
    }
  }, [files]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (plan === "Free") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <Button onClick={() => router.push('/dashboard/pricing')} className="mb-6">
          Upgrade Plan
        </Button>
        <h2 className="text-2xl font-bold mb-4">You're on the Free Plan</h2>
        <p className="text-gray-600 mb-2">
          Upgrade your plan to use Code Reviewer AI Agent.
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Code Reviewer AI Agent</h1>
        <Button variant="outline" onClick={() => setDialogOpen(true)}>
          Change Repo
        </Button>
      </header>

      <div className="space-y-6 mb-6">
        <p className="mt-3">
          Drop your Github repo URL, and let AI handle the code review. Instant insights, suggestions, and improvements - no manual effort needed.{" "}
          <span className="text-black rounded-md font-bold px-1" style={{ backgroundColor: "#e5e7eb" }}>
            Click on highlighted syntaxes for more details.
          </span>
        </p>

        <ReviewClient
          files={files}
          selectedFile={{ content: selectedFileContent }}
          file={selectedFile}
          onSelectFile={fetchFileContent}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Github className="w-5 h-5" />
              Enter GitHub Repo
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-mono text-muted-foreground">/</span>
            <Input
              className="w-32"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="text-lg font-mono text-muted-foreground">/</span>
            <Input
              className="w-44"
              placeholder="repo-name"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button
              onClick={fetchGitHubFiles}
              disabled={!username || !repo}
              className="w-full"
            >
              Load Repository Files
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
