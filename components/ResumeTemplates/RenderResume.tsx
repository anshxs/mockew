import React from "react"
import { Resume } from "@/types/resume"
import TemplateOne from "./TemplateOne"

interface RenderResumeProps {
  templateId: string
  resumeData: Resume
  colorPalette: string | string[]
  containerWidth: number
}

const RenderResume: React.FC<RenderResumeProps> = ({
  templateId,
  resumeData,
  colorPalette,
  containerWidth,
}) => {
  switch (templateId) {
    case "01":
      return (
        <TemplateOne
          resumeData={resumeData}
          colorPalette={colorPalette}
          containerWidth={containerWidth}
        />
      );
    default:
      return (
        <TemplateOne
          resumeData={resumeData}
          colorPalette={colorPalette}
          containerWidth={containerWidth}
        />
      );
  }
};

export default RenderResume;
