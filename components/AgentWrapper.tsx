// components/AgentWrapper.tsx
"use client";

import { useUser } from "@stackframe/stack";
import Agent from "@/components/Agent";

const AgentWrapper = ({ interview }: { interview: any }) => {
  const user = useUser();

  if (!user) return null; // Or some loading state

  return (
    <Agent
      userName={user?.displayName!}
      userId={user.id}
      interviewId={interview.id}
      type="interview"
      questions={interview.questions}
      feedbackId={undefined} // Optionally fetch this client-side or pass from server
    />
  );
};

export default AgentWrapper;
