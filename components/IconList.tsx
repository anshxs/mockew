import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect } from "react";
import { DialogHeader } from "./ui/dialog";
import { icons, Smile } from "lucide-react";
import { iconList } from "@/constants/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import axios from "axios";
import { get } from "http";

interface IconListProps {
  selectedIcon: (icon: string) => void; // Accepts a callback function
}

const IconList = ({ selectedIcon }: IconListProps) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  //  const [pngIconList, setPngIconList] = React.useState<string[]>([]);
  const Icon = ({
    name,
    color,
    size,
  }: {
    name: keyof typeof icons;
    color?: string;
    size?: number;
  }) => {
    const LucideIcon = icons[name];
    if (!LucideIcon) return null;
    return <LucideIcon size={size} color={color} />;
  };
  const storageValue = JSON.parse(localStorage.getItem("logoMaker") || "{}");
  const [icon, setIcon] = React.useState(storageValue.icon ?? "Smile");
  // Directly define the PNG icon list instead of fetching from API
  const pngIconList = ["002-rocket-1.png","014-developer.png","008-meat.png","004-project.png","014-google-forms.png","006-3d-rocket.png","016-video-marketing.png","009-startup-1.png","015-palette.png","020-youtube-1.png","017-world-wildlife-day.png","001-camera.png","016-ai-1.png","004-tools.png","011-sandwich-1.png","022-video-editor.png","013-gold-medal-1.png","002-love.png","010-wallet.png","007-money.png","012-launch.png","004-perfume.png","008-hand.png","015-logo-design.png","011-rocket-5.png","003-rocket-2.png","001-flash.png","006-camera-4.png","019-snorlax.png","009-winner.png","029-watermelon.png","003-camera-1.png","005-camera-3.png","015-skewer.png","020-hacking.png","025-passion-fruit.png","007-rocket-3.png","014-ice-cream.png","033-apple-tree.png","012-masala-dosa.png","004-burger.png","005-startup.png","003-bucket.png","002-flash-1.png","006-taco.png","009-coin.png","003-love-1.png","021-binary-code.png","023-play-2.png","010-silver-medal.png","031-avocado.png","018-pikachu.png","005-basic-needs.png","007-ai.png","015-hacker.png","027-apple.png","007-prawn.png","002-photo.png","005-maki.png","009-salad.png","019-play.png","007-medal.png","012-setting-1.png","002-app-store.png","011-medal-1.png","009-picture.png","008-gold-medal.png","024-pause.png","003-shortcut-script-app.png","008-image.png","021-play-1.png","012-mobile-app.png","006-chatbot.png","001-rocket.png","032-dragon-fruit.png","006-puzzle.png","004-chat.png","006-love-2.png","013-galaxy.png","028-drink.png","001-present.png","014-gold-medal-2.png","022-fruits.png","026-fruit.png","024-vegetables.png","013-masala-dosa-1.png","010-sandwich.png","017-youtube.png","005-lightbulb.png","005-happy-mothers-day.png","008-rocket-4.png","016-noodles.png","018-virus.png","007-photo-gallery.png","013-contract.png","016-color-palette.png","011-text.png","011-piggy-bank.png","014-social.png","030-fruit-tree.png","009-image.png","001-google-apps-script.png","019-hacker-3.png","010-success.png","015-rocket.png","017-hacker-2.png","016-hacker-1.png","012-star-medal.png","023-eevee.png","024-psyduck.png","018-video-chat.png","025-meowth.png","013-code.png","022-jigglypuff.png","002-balanced-diet.png","003-pizza.png","010-setting.png","020-charmander.png","021-bullbasaur.png","023-pineapple.png","008-money-bag.png","004-camera-2.png"];

  return (
    <>
      <div>
        <label>Icon</label>
        <div
          onClick={() => setOpenDialog(true)}
          className="p-3 my-2 cursor-pointer bg-secondary rounded-lg hover:bg-secondary/80 transition-all w-[50px] h-[50px] flex items-center justify-center"
        >
          {icon.includes("png") ? (
            <img
              src={`https://logoexpress.tubeguruji.com/png/${icon}`}
              alt={icon}
              className="w-8 h-8"
            />
          ) : (
            <Icon name={icon} color="#000" size={24} />
          )}
          
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pick an icon</DialogTitle>
            <DialogDescription>
              <Tabs defaultValue="icons" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="icons">Icons</TabsTrigger>
                  <TabsTrigger value="color-icons">Color Icons</TabsTrigger>
                </TabsList>
                <TabsContent value="icons">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-auto h-[400px] p-6">
                    {iconList
                      .filter(
                        (icon): icon is keyof typeof icons =>
                          typeof icon === "string" && icon in icons
                      )
                      .map((icon, index) => (
                        <div
                          onClick={() => {
                            selectedIcon(icon);
                            setOpenDialog(false);
                            setIcon(icon);
                          }}
                          key={icon}
                          className="border p-3 flex rounded-sm items-center cursor-pointer justify-center bg-secondary"
                        >
                          <Icon name={icon} color="#000" size={20} />
                        </div>
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="color-icons">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-auto h-[400px] p-6">
                    {pngIconList
                      .map((icon, index) => (
                        <div
                          onClick={() => {
                            selectedIcon(icon);
                            setOpenDialog(false);
                            setIcon(icon);
                          }}
                          key={icon}
                          className="border p-3 flex rounded-sm items-center cursor-pointer justify-center bg-secondary"
                        >
                          <img
                            src={`/${icon}`}
                            alt={icon}
                            className="w-8 h-8"
                          />
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default IconList;