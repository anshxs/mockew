// Add the `"use client"` directive at the top of the file
'use client';

import Image from "next/image";
import React from "react";
import { redirect } from "next/navigation";
import { getInterviewById } from "@/lib/actions/general.action"; // Your server-side logic for fetching data
import { getRandomInterviewCover } from "@/lib/utils"; // Your utility for cover image
import { useEffect, useState } from "react";

// Define types for the props expected in the component
type Props = {
  params: {
    id: string;
  };
};

const InterviewDetails = ({ params }: Props) => {
  const [interview, setInterview] = useState<any>(null);
  const [AgentWrapper, setAgentWrapper] = useState<any>(null);
  const [DisplayTechIcons, setDisplayTechIcons] = useState<any>(null);

  const { id } = React.use(params);

  useEffect(() => {
    // Fetch the interview data on the client side
    const fetchData = async () => {
      const interviewData = await getInterviewById(id);
      if (!interviewData) {
        redirect("/dashboard");
      }
      setInterview(interviewData);
    };

    // Dynamically load the client components
    const loadComponents = async () => {
      const { default: AgentWrapper } = await import("@/components/AgentWrapper");
      const { default: DisplayTechIcons } = await import("@/components/DisplayTechIcons");
      setAgentWrapper(() => AgentWrapper);
      setDisplayTechIcons(() => DisplayTechIcons);
    };

    fetchData();
    loadComponents();
  }, [id]);

  // If the interview data or client components are not yet loaded, show a loading message
  if (!interview || !AgentWrapper || !DisplayTechIcons) {
    return <div>Loading...</div>;
  }

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

      {/* Rendering the dynamically loaded AgentWrapper */}
      <AgentWrapper interview={interview} />
    </>
  );
};

export default InterviewDetails;
