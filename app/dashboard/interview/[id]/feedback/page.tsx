import { ReactElement } from "react";
import { getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import FeedbackClient from "./FeedbackClient";

const Feedback = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const interview = await getInterviewById(id);
  if (!interview) redirect("/dashboard");

  return <FeedbackClient interviewId={id} interview={interview} />;
};
  
  export default Feedback;
