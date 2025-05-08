"use client";

import { useState } from "react";
import { UserButton } from "@stackframe/stack";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Dim and scale site when drawer is open */}
      <div className={open ? "scale-95 blur-sm transition-all duration-300" : "transition-all duration-300"}>
        <header className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
          <SparklesText className="text-xl font-extrabold">MOCKEW AI</SparklesText>
          <div className="flex items-center gap-2">
            <UserButton />
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </DrawerTrigger>
              <DrawerContent
                side="right"
                className="bg-gray-200 p-4 flex flex-col justify-between h-full w-[300px]"
              >
                <div>
                  <DrawerHeader>
                    <DrawerTitle>Menu</DrawerTitle>
                  </DrawerHeader>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Dashboard
                  </Button>
                  <div className="flex-grow" />
                  <Button variant="ghost" className="w-full justify-start">
                    Pricing
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Terms and Conditions
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Contact Us
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Refund Policy
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </header>
      </div>
    </>
  );
}
