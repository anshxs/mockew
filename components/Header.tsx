"use client";

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
  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
      <SparklesText className="text-xl font-extrabold">MOCKEW AI</SparklesText>
      <div className="flex items-center gap-2">
        <UserButton />
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4 flex flex-col bg-white justify-between">
            <div>
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-start bg-secondary">
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full bg-secondary justify-start">
                Pricing
              </Button>
              <Button variant="ghost" className="w-full bg-secondary justify-start">
                Terms and Conditions
              </Button>
              <Button variant="ghost" className="w-full bg-secondary justify-start">
                Contact Us
              </Button>
              <Button variant="ghost" className="w-full bg-secondary justify-start">
                Refund Policy
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
        }
