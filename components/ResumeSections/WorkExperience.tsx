import React from "react";

interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
  durationColor: string;
}

const WorkExperience: React.FC<WorkExperience> = ({
  company,
  role,
  duration,
  description,
  durationColor,
}) => {
  return (
    <div className="mb-5">
      <div className="flex items-start justify-between">
        <div>
            <h3 className="text-[15px] font-semibold text-gray-900">{company}</h3>
            <p className="text-[15px] text-gray-700 font-medium">{role}</p>
          </div>
          <p className="text-xs font-bold italic" style={{ color: durationColor }}>
            {duration}
          </p>
          <p className="text-sm text-gray-600 font-medium italic mt-[0.2cqw]">{description}</p>
        </div>
      </div>
  );
};
export default WorkExperience;
