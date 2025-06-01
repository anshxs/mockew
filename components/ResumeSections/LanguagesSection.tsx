import React from "react";
import Progress from "../Progress";
import { Language } from "@/types/resume";

interface LanguageInfoProps {
  language: string;
  progress: number;
  accentColor: string;
  bgColor: string;
}
interface LanguageSectionProps {
  languages: Language[] | undefined;
  accentColor: string;
  bgColor: string;
}

const LanguageInfo: React.FC<LanguageInfoProps> = ({
  language,
  progress,
  accentColor,
  bgColor,
}) => {
  return (
    <div className="flex items-center justify-between">
      <p className={`text-[12px] font-semibold text-gray-900`}>{language}</p>
      {progress > 0 && (
        <Progress
          progress={(progress/100) * 5}
          color={accentColor}
          bgColor={bgColor}
        />
      )}
    </div>
  );
};

const LanguagesSection: React.FC<LanguageSectionProps> = ({
    languages,
    accentColor,
    bgColor
}) => {
    return <div className="flex flex-col gap-2">
        {languages?.map((lang, index) => (
            <LanguageInfo
                key={index}
                language={lang.name}
                progress={(lang.proficiency /5) * 100} // Assuming proficiency is out of 5
                accentColor={accentColor}
                bgColor={bgColor}
            />
        ))}
    </div>
};

export { LanguageInfo, LanguagesSection };