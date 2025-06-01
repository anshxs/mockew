"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
import { backgrounds } from "@/utils/utilities";
import OutsideClickHandler from "react-outside-click-handler";
import { Button } from "./ui/button";

interface BackgroundSelectorProps {
  background: string;
  setBackground: (background: string) => void;
}

function BackgroundSelector({
  background,
  setBackground,
}: BackgroundSelectorProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleBackgroundChange = (newBackground: string) => {
    setBackground(newBackground);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setShowDropdown(false)}>
      <div className="bg-selector relative" onClick={toggleDropdown}>
        <p className="py-[5px] text-sm font-medium">Theme Selector</p>
        <Button
          variant="secondary"
          className="w-full mb-1 border-2 text-left transition-all duration-300 ease-in-out"
          onClick={toggleDropdown}
        >
          <div
            className="rounded-full w-[20px] h-[20px]"
            style={{
              background: background,
            }}
          ></div>
          <ChevronDown />
        </Button>
        {showDropdown && (
          <div className="absolute px-2 pt-2 pb-2 bg-white border-2 rounded-3xl top-[74px]">
            {backgrounds.map((bg, i) => {
              return (
                <Button
                                    variant="secondary"
                                    className="w-[20px] h-[20px] rounded-full mb-1 border-2 text-left transition-all duration-300 ease-in-out"
                  key={i}
                  onClick={() => handleBackgroundChange(bg)}
                  style={{ background: bg }}
                ></Button>
              );
            })}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
}

export default BackgroundSelector;
