import { getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import FeedbackClient from "./FeedbackClient";

interface RouteParams {
  params: {
    id: string;
  };
}

const FeedbackPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const interview = await getInterviewById(id);
  if (!interview) redirect("/dashboard");

  return <FeedbackClient interviewId={id} interview={interview} />;
};

export default FeedbackPage;
