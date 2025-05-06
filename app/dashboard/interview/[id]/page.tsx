// app/dashboard/interview/[id]/page.tsx

import Image from "next/image";
import { redirect } from "next/navigation";
import { getInterviewById } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";

// ⛔️ DO NOT import `AgentWrapper` or `DisplayTechIcons` here

const InterviewDetails = async ({ params }: { params: { id: string } }) => {
  const id = params.id;

  const interview = await getInterviewById(id);
  if (!interview) redirect("/dashboard");

  // ✅ Now safely import client components inside JSX
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
            <h3 className="capitalize text-2xl font-semibold">{interview.role} Interview</h3>
          </div>
          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-secondary px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <AgentWrapper interview={interview} />
    </>
  );
};

export default InterviewDetails;
