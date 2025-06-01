import { Slider } from "@/components/ui/slider";
import React, { useEffect } from "react";
import ColorController from "./ColorController";
import { UpdateStorageContext } from "./UpdateStorageContext";

export function BackgroundController() {
  const storageValue = JSON.parse(localStorage.getItem("logoMaker") || "{}");
  const [rounded, setRounded] = React.useState(storageValue.bgRounded ?? 0);
  const [padding, setPadding] = React.useState(storageValue.bgPadding ?? 0);
  const [color, setColor] = React.useState(storageValue.bgBackgroundColor ?? "rgba(255,255,255,1)");
  const {updateStorage, setUpdateStorage} = React.useContext(UpdateStorageContext);
  useEffect(() => {
    const updatedValue = {
      ...storageValue,
      bgRounded: rounded,
      bgPadding: padding,
      bgBackgroundColor: color,
    };
    setUpdateStorage(updatedValue);
    localStorage.setItem("logoMaker", JSON.stringify(updatedValue));
  }, [rounded, padding, color]);

  return (
    <div>
      <div className="py-2">
        <label className="p-2 flex justify-between items-center">
          Rounded <span>{rounded} px</span>
        </label>
        <Slider
          defaultValue={[rounded]}
          max={100}
          step={1}
          className="w-full mt-2"
          onValueChange={(event) => setRounded(event[0])}
        />
      </div>
      <div className="py-2">
        <label className="p-2 flex justify-between items-center">
          Padding <span>{padding} px</span>
        </label>
        <Slider
          defaultValue={[padding]}
          max={512}
          step={1}
          className="w-full mt-2"
          onValueChange={(event) => setPadding(event[0])}
        />
      </div>
      <div className="py-2">
          <label className="p-2 flex justify-between items-center">Background Color</label>
          <ColorController hideController={false} selectedColor={color} setSelectedColor={(color)=>setColor(color)}/>
        </div>
    </div>
  );
}
