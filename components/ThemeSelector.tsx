"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
import { themes } from "@/utils/utilities";
import OutsideClickHandler from "react-outside-click-handler";
import { Button } from "./ui/button";

interface ThemeSelectorProps {
  theme: string;
  setTheme: (theme: string) => void;
}

function ThemeSelector({ theme, setTheme }: ThemeSelectorProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setShowDropdown(false)}>
      <div className="theme-selector" onClick={toggleDropdown}>
        <p className="py-[5px] text-sm font-medium">Code Colors</p>
        <Button
          variant="secondary"
          className="w-full mb-1 border-2 text-left transition-all duration-300 ease-in-out"
          onClick={toggleDropdown}
        >
          {theme} <ChevronDown />
        </Button>
        {showDropdown && (
          <div className="absolute px-2 pt-2 pb-2 bg-white border-2 rounded-3xl w-[120px] top-[94px]">
            {themes.map((theme, i) => {
              return (
                <Button
                  key={i}
                  variant="secondary"
                  className="w-full mb-1 border-2 text-left transition-all duration-300 ease-in-out"
                  onClick={() => handleThemeChange(theme)}
                >
                  {theme}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
}

export default ThemeSelector;
