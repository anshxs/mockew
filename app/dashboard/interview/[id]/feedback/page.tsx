import { getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import FeedbackClient from "./FeedbackClient";

export default async function Feedback({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const interview = await getInterviewById(id);
  if (!interview) redirect("/dashboard");

  return <FeedbackClient interviewId={id} interview={interview} />;
}
