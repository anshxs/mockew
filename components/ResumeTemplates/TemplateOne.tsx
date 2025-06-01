import React, { useEffect, useRef, useState } from "react";
import { Resume } from "@/types/resume";
import {
  LucideMail,
  LucidePhone,
  LucideRss,
  LucideGithub,
  LucideUser,
  LucideMapPinHouse,
  LucideLinkedin,
} from "lucide-react";
import { color } from "motion/react";
import ContactInfo from "../ResumeSections/ContactInfo";
import { EducationInfo } from "../ResumeSections/EducationInfo";
import { LanguagesSection } from "../ResumeSections/LanguagesSection";
import WorkExperience from "../ResumeSections/WorkExperience";
import ProjectInfo from "../ResumeSections/ProjectInfo";
import SkillsSection from "../ResumeSections/SkillsSection";
import CertificationInfo from "../ResumeSections/CertificationInfo";

interface TemplateOnerops {
  resumeData: Resume;
  colorPalette: string | string[];
  containerWidth: number;
}

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#08B8DB", "#4A5566"];

type TitleProps = {
  text: string;
  color: string;
};

const Title = ({ text, color }: TitleProps) => {
  return (
    <div className="mb-2.5 border-t font-bold border-dashed border-gray-300 pt-2">
      {text}
    </div>
  );
};

const TemplateOne: React.FC<TemplateOnerops> = ({
  resumeData,
  colorPalette,
  containerWidth,
}) => {
  const themeColors = colorPalette.length > 0 ? colorPalette : DEFAULT_THEME;
  const resumeRef = useRef<HTMLDivElement>(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const actualBaseWidth = resumeRef.current?.offsetWidth ?? 800; // fallback to 800 if undefined
    setBaseWidth(actualBaseWidth);
    setScale(containerWidth / actualBaseWidth);
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className="p-3 bg-white"
      style={{
        transform: containerWidth > 0 ? `scale[${scale}]` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "auto",
        height: "auto",
      }}
    >
      <div className="grid grid-cols-10 gap-8 break-all">
        <div
          className="col-span-4 py-10 rounded-3xl"
          style={{ backgroundColor: themeColors[0] }}
        >
          <div className="flex flex-col items-center px-2">
            <div
              className="w-[100px] h-[100px] max-w-[110px] max-h-[110px] flex items-center justify-center rounded-full"
              style={{ backgroundColor: themeColors[1] }}
            >
              {resumeData.profile_preview_url ? (
                <img
                  src={resumeData.profile_preview_url}
                  className="w-[90px] h-[90px] rounded-full"
                />
              ) : (
                <div
                  className="w-[90px] h-[90px] flex items-center justify-center text-5xl rounded-full"
                  style={{ color: themeColors[4] }}
                >
                  <LucideUser />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold mt-3">{resumeData.full_name}</h2>
            <p className="text-sm text-center">{resumeData.designation}</p>
          </div>
          <div className="my-6 mx-6">
            <div className="flex flex-col gap-4">
              <ContactInfo
                icon={<LucideMapPinHouse />}
                iconBG={themeColors[2]}
                value={resumeData.contact_location}
              />
              <ContactInfo
                icon={<LucideMail />}
                iconBG={themeColors[2]}
                value={resumeData.contact_email}
              />
              <ContactInfo
                icon={<LucidePhone />}
                iconBG={themeColors[2]}
                value={resumeData.contact_phone}
              />
              {resumeData.contact_github && (
                <ContactInfo
                  icon={<LucideGithub />}
                  iconBG={themeColors[2]}
                  value={resumeData.contact_github}
                />
              )}
              {resumeData.contact_linkedin && (
                <ContactInfo
                  icon={<LucideLinkedin />}
                  iconBG={themeColors[2]}
                  value={resumeData.contact_linkedin}
                />
              )}
              <ContactInfo
                icon={<LucideRss />}
                iconBG={themeColors[2]}
                value={resumeData.contact_website}
              />
            </div>
            <div className="mt-5">
              <Title text="Education" color={themeColors[1]} />
              {resumeData.education?.map((edu, index) => (
                <EducationInfo
                  key={index}
                  institution={edu.institution}
                  degree={edu.degree}
                  duration={`${edu.start_date} - ${edu.end_date || "Present"}`}
                />
              ))}
            </div>
            <div className="mt-5">
              <Title text="Languages" color={themeColors[1]} />
              <LanguagesSection
                languages={resumeData.languages}
                accentColor={themeColors[3]}
                bgColor={themeColors[2]}
              />
            </div>
          </div>
        </div>
        <div className="col-span-6 pt-10 mr-10 pb-5">
          <div className="px-6">
            <Title text="Summary" color={themeColors[1]} />
            <p className="text-sm font-medium">
              {resumeData.summary || "No summary provided."}
            </p>
            <div className="mt-4">
              <Title text="Work Experience" color={themeColors[1]} />
              {resumeData.work_experience?.map((exp, index) => (
                <WorkExperience
                  key={index}
                  company={exp.company}
                  role={exp.role}
                  duration={`${exp.start_date} - ${exp.end_date || "Present"}`}
                  description={exp.description}
                  durationColor={themeColors[4]}
                />
              ))}
            </div>

            <div className="mt-4">
              <Title text="Projects" color={themeColors[1]} />
              {resumeData.projects?.map((project, index) => (
                <ProjectInfo
                  key={index}
                  title={project.title}
                  description={project.description}
                  githubLink={project.github_link}
                  liveDemoUrl={project.live_demo_url}
                  bgColor={themeColors[2]}
                />
              ))}
            </div>

            <div className="mt-4">
              <Title text="Skills" color={themeColors[1]} />
              <SkillsSection
                skills={resumeData.skills}
                bgColor={themeColors[2]}
                accentColor={themeColors[3]}
              />
            </div>

            <div className="mt-4">
              <Title text="Certifications" color={themeColors[1]} />
              {resumeData.certifications?.map((cert, index) => (
                <CertificationInfo
                  key={index}
                  title={cert.title}
                  issuer={cert.issuer}
                  year={cert.year}
                  bgColor={themeColors[2]}
                />
              ))}
            </div>
            {resumeData.interests && resumeData.interests.length > 0 && (
            <div className="mt-4">
              <Title text="Interests" color={themeColors[1]} />
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {resumeData.interests.map((interest, index) => (
                    <div key={index}
                      className="text-[10px] font-medium py-1 px-3 rounded-lg"
                      style={{ backgroundColor: themeColors[2]}}
                    >
                      {interest}
                    </div>
                  
                ))}
              </div>
              </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateOne;
