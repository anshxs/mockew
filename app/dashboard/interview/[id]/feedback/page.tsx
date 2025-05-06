// app/dashboard/[id]/feedback/page.tsx

import { getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import FeedbackClient from "./FeedbackClient";

type FeedbackPageProps = {
  params: {
    id: string;
  };
};

const FeedbackPage = async ({ params }: FeedbackPageProps) => {
  const id = params.id;

  const interview = await getInterviewById(id);

  if (!interview) {
    redirect("/dashboard");
  }

  return <FeedbackClient interviewId={id} interview={interview} />;
};

export default FeedbackPage;
