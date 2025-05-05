import { getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import FeedbackClient from "./FeedbackClient";

// Define the type for the route parameters passed to the page
interface FeedbackPageProps {
  params: {
    id: string;
  };
}

const FeedbackPage = async ({ params }: FeedbackPageProps) => {
  const { id } = params;

  // Fetch interview data based on the ID
  const interview = await getInterviewById(id);

  // If no interview is found, redirect to the dashboard
  if (!interview) redirect("/dashboard");

  // Render the client component with interview data
  return <FeedbackClient interviewId={id} interview={interview} />;
};

export default FeedbackPage;
