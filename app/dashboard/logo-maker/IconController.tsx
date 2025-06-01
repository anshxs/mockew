import { Slider } from "@/components/ui/slider";
import { Smile } from "lucide-react";
import React, { useContext, useEffect } from "react";
import ColorController from "./ColorController";
import { UpdateStorageContext } from "./UpdateStorageContext";
import IconList from "@/components/IconList";

export function IconController() {
  const storageValue=JSON.parse(localStorage.getItem('logoMaker') || '{}');
  const {updateStorage, setUpdateStorage} = useContext(UpdateStorageContext);
  const [iconSize, setIconSize] = React.useState(storageValue.iconSize ?? 280);
  const [rotate, setRotate] = React.useState(storageValue.rotate ?? 0);
  const [iconColor, setIconColor] = React.useState(storageValue.iconColor ?? "rgba(255,255,255,1)");
  const [icon,setIcon] = React.useState(storageValue.icon ?? 'Smile');

  useEffect(() => {
    const updatedValue= {
      ...storageValue,
      iconSize: iconSize,
      rotate: rotate,
      iconColor: iconColor,
      icon: icon
    };
    setUpdateStorage(updatedValue);
    localStorage.setItem('logoMaker', JSON.stringify(updatedValue));
  }, [iconSize, rotate, iconColor,icon]);
  
  return (
    <div>
      <div>
        <IconList selectedIcon={(icon)=>setIcon(icon)}/>
        <div className="py-2">
          <label className="p-2 flex justify-between items-center">Size <span>{iconSize} px</span></label>
          <Slider defaultValue={[iconSize]} max={512} step={1} className="w-full mt-2" onValueChange={(event)=>setIconSize(event[0])}/>
        </div>
        <div className="py-2">
          <label className="p-2 flex justify-between items-center">Rotate <span>{rotate} °</span></label>
          <Slider defaultValue={[rotate]} max={360} step={1} className="w-full mt-2" onValueChange={(event)=>setRotate(event[0])}/>
        </div>
        <div className="py-2">
          <label className="p-2 flex justify-between items-center">Icon Color</label>
          <ColorController selectedColor={iconColor} hideController={true} setSelectedColor={(color)=>setIconColor(color)}/>
        </div>
      </div>
    </div>
  );
}
