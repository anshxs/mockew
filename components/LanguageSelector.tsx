"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
import { languages } from "@/utils/utilities";
import OutsideClickHandler from "react-outside-click-handler";
import { Button } from "./ui/button";

interface LanguageSelectorProps {
  language: string;
  setLanguage: (language: string) => void;
  seActiveIcon: (icon: string) => void;
}

function LanguageSelector({
  language,
  setLanguage,
  seActiveIcon,
}: LanguageSelectorProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const newActiveIcon = languages.find(
      (lang) => lang.name === newLanguage
    )?.icon;

    if (newActiveIcon) {
      seActiveIcon(newActiveIcon);
    }
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setShowDropdown(false)}>
      <div onClick={toggleDropdown}>
        <p className="py-[5px] text-sm font-medium">Language</p>
        <Button
          variant="secondary"
          className="w-full mb-1 border-2 text-left transition-all duration-300 ease-in-out"
          onClick={toggleDropdown}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <img
                src={languages.find((lang) => lang.name === language)?.icon}
                alt={language}
                className="w-5 h-5 mr-2"
              />
              {language}
            </span>
          </div>
          <ChevronDown />
        </Button>
          

        {showDropdown && (
          <div className="absolute px-2 pt-2 pb-2 bg-white border-2 rounded-3xl w-[120px] top-[94px]">
            {languages.map((lang, i) => {
              return (
                <div key={i}>
                  <Button
                    variant="secondary"
                    className="w-full mb-1 border-2 text-left transition-all duration-300 ease-in-out"
                    onClick={() => handleLanguageChange(lang.name)}
                  >
                    {lang.name}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
}

export default LanguageSelector;
