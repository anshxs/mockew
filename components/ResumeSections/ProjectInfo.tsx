import { LucideExternalLink, LucideGithub } from "lucide-react";
import React from "react";
import ActionLink from "./ActionLink";

interface ProjectInfoProps {
  title: string;
  description: string;
  githubLink: string | undefined;
  liveDemoUrl: string | undefined;
  bgColor: string;
  isPreview?: boolean;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({
  title,
  description,
  githubLink,
  liveDemoUrl,
  bgColor,
  isPreview,
}) => {
  return (
    <div className="mb-5">
      <h3
        className={`${
          isPreview ? "text-xs" : "text-base"
        } font-semibold text-gray-900`}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-700 font-medium mt-1">{description}</p>
      <div className="flex items-center gap-3 mt-2">
        {githubLink && (
          <ActionLink
            icon={<LucideGithub />}
            link={githubLink}
            bgColor={bgColor}
          />
        )}
        {liveDemoUrl && (
          <ActionLink
            icon={<LucideExternalLink />}
            link={liveDemoUrl}
            bgColor={bgColor}
          />
        )}
      </div>
    </div>
  );
};
export default ProjectInfo;
