'use client';

import { Button } from "@/components/ui/button";
import { Image, PencilRuler } from "lucide-react";
import React, { act } from "react";

interface SideNavProps {
  selectedIndex: (id: number) => void;
}

function SideNav({selectedIndex}: SideNavProps) {
    const [activeMenu, setActiveMenu] = React.useState<number | null>(null);
  const menuList = [
    {
      id: 1,
      name: "Icon",
      icon: PencilRuler,
    },
    {
      id: 2,
      name: "Background",
      icon: Image,
    },
  ];

  return (
    <div>
      <div>
        {menuList.map((item,index) => (
          <Button key={index} variant="ghost" className={`w-full mb-2 justify-start ${activeMenu === item.id ? 'bg-secondary' : ''}`} 
          onClick={() => {setActiveMenu(item.id)
            selectedIndex(item.id)
          }}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
            </Button>
        ))}
      </div>
    </div>
  );
}

export default SideNav;
