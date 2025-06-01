import React from "react";

interface EducationInfoProps {
  institution: string;
  degree: string;
  duration: string;
}

export const EducationInfo: React.FC<EducationInfoProps> = ({
  institution,
  degree,
  duration,
}) => {
  return (
    <div className="mb-5">
      <h3 className={`text-[15px] font-semibold text-gray-900`}>{degree}</h3>
      <p className="text-xs text-gray-700 font-medium">{institution}</p>
      <p className="text-xs text-gray-500 font-medium italic mt-0.5">{duration}</p>
    </div>
  );
}