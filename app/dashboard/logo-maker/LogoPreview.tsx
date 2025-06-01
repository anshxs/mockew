import React, { useContext, useEffect, useState } from "react";
import { UpdateStorageContext } from "./UpdateStorageContext";
import { icons } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas-pro";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";

export function LogoPreview() {
  const [storageValue, setStorageValue] = useState<Record<string, any>>({});
  const { updateStorage } = useContext(UpdateStorageContext);
  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem("logoMaker") || "{}");
    setStorageValue(storageData);
  }, [updateStorage]);

  const Icon = ({
    name,
    color,
    size,
    rotate,
  }: {
    name: keyof typeof icons;
    color?: string;
    size?: number;
    rotate?: number;
  }) => {
    const LucideIcon = icons[name];
    if (!LucideIcon) return null;
    return (
      <LucideIcon
        size={size}
        color={color}
        style={{ transform: `rotate(${rotate}deg)` }}
      />
    );
  };
  const DownloadIcon = () => {
    const downloadLogoDiv = document.getElementById('downloadLogoDiv');
    if (!downloadLogoDiv) return;
    html2canvas(downloadLogoDiv, {
      backgroundColor: null
    }).then(canvas => {
      const pngImage = canvas.toDataURL("image/png");
      const downloadLink = document.createElement('a');
      downloadLink.href = pngImage;
      downloadLink.download = 'Logo.png';
      downloadLink.click();
    });
  }

  return (
    <div>
      <div className="flex flex-row-reverse">
        <Button
          variant={"secondary"}
          onClick={() => {
            DownloadIcon();
          }}
        >
          Download
        </Button>
      </div>
      <div className="flex items-center justify-center h-screen -mt-24">
        <div
          className="h-[500px] w-[500px] bg-secondary outline-dotted"
          style={{ padding: `${storageValue?.bgPadding || 0}px` }}
        >
          <div
          id="downloadLogoDiv"
            className="h-full w-full items-center justify-center flex"
            style={{
              borderRadius: `${storageValue?.bgRounded || 0}px`,
              background:
                storageValue?.bgBackgroundColor || "rgba(255,255,255,1)",
            }}
          >
            {storageValue?.icon?.includes('png') ?<img style={{
              height: `${storageValue?.iconSize}px`,
              width: `${storageValue?.iconSize}px`,
              transform: `rotate(${storageValue?.rotate}deg)`,
              objectFit: "contain",
            }} src={`/${storageValue.icon}`}/> : (
              <Icon
                name={storageValue.icon}
                color={storageValue?.iconColor}
                size={storageValue?.iconSize}
                rotate={storageValue?.rotate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
