import React from "react";
import Progress from "../Progress";
import { Skill } from "@/types/resume";

interface SkillInfoProps {
  skill: string;
  bgColor: string;
  accentColor: string;
  progress: number;
}

const SkillInfo: React.FC<SkillInfoProps> = ({
  skill,
  bgColor,
  accentColor,
  progress,
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className={`text-[12px] font-semibold text-gray-900`}>{skill}</p>
      {progress > 0 && (
        <Progress
         progress={progress}
         bgColor={bgColor}
         color={accentColor} />
        )}
    </div>
  );
};

const SkillsSection: React.FC<{
  skills: Skill[] | undefined;
  bgColor: string;
  accentColor: string;
}> = ({ skills, bgColor, accentColor }) => {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-1 mb-5">
        {skills?.map((item, index) => (
          <SkillInfo
            key={index}
            skill={item?.name || ""}
            bgColor={bgColor}
            accentColor={accentColor}
            progress={item?.proficiency || 5}
          />
        ))}
    </div>
  );
}
export default SkillsSection;