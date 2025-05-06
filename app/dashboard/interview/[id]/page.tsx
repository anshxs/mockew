import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getInterviewById } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";

// Define props interface
interface InterviewDetailsProps {
  params: {
    id: string;
  };
}

const InterviewDetails = async ({ params }: InterviewDetailsProps) => {
  const id = params.id;

  const interview = await getInterviewById(id);
  if (!interview) redirect("/dashboard");

  const AgentWrapper = (await import("@/components/AgentWrapper")).default;
  const DisplayTechIcons = (await import("@/components/DisplayTechIcons")).default;

  return (
    <>
      <div className="flex flex-row gap-4 justify-between my-6">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize text-2xl font-semibold">
              {interview.role} Interview
            </h3>
          </div>
          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-secondary px-4 py-2 rounded-lg h-fit">{interview.type}</p>
      </div>

      <AgentWrapper interview={interview} />
    </>
  );
};

export default InterviewDetails;
