"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // or your own toast library

interface ReviewButtonProps {
  selectedFile: string;
  fileContent: string;
  setReview: (review: string) => void;
}

export function ReviewButton({
  selectedFile,
  fileContent,
  setReview,
}: ReviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleReview = async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    const messages = [
      {
        role: "system",
        content:
          "You are a senior software engineer. Review the following code in detail, with line numbers and clear recommendations.",
      },
      {
        role: "user",
        content: fileContent,
      },
    ];

    try {
      // First try: Pollinations AI
      const pollinationsRes = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          model: "gpt-4",
          jsonMode: true,
        }),
      });

      const pollinationsData = await pollinationsRes.json();

      if (!pollinationsData?.text?.trim()) throw new Error("Empty response");

      setReview(pollinationsData.text);
    } catch (error) {
      toast.warning("Our 1st AI failed, switching to advanced mode...");

      try {
        // Fallback: Gemini
        const geminiRes = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: fileContent }),
        });

        const geminiData = await geminiRes.json();

        if (geminiData?.result) {
          setReview(geminiData.result);
        } else {
          throw new Error("Gemini response missing result");
        }
      } catch (fallbackError) {
        console.error("Gemini fallback failed:", fallbackError);
        toast.error("Both AIs failed to generate a review.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleReview} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Reviewing...
        </>
      ) : (
        "Review File"
      )}
    </Button>
  );
}
