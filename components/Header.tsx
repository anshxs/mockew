"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import Link from "next/link";
import { PanelRight } from "lucide-react";

// Dynamically import UserButton to avoid SSR issues
const UserButton = dynamic(() => import("@stackframe/stack").then(mod => mod.UserButton), {
  ssr: false,
});

export default function Header() {
  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SparklesText className="text-xl font-extrabold">MOCKEW AI</SparklesText>
      </div>

      <div className="flex items-center gap-2">
        <UserButton />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0">
              <PanelRight className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[300px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle className="text-lg text-left">Menu</SheetTitle>
            </SheetHeader>

            <div className="mt-4 flex flex-col gap-2">
              {/* Top Buttons */}
              <div className="flex flex-col gap-2">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-start bg-secondary">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/resume-build">
                  <Button variant="ghost" className="w-full justify-start bg-secondary">
                    Resume Builder
                  </Button>
                </Link>
                <Link href="/link-gen">
                  <Button variant="ghost" className="w-full justify-start bg-secondary">
                    Link Dance
                  </Button>
                </Link>
                <Link href="/reviewer">
                  <Button variant="ghost" className="w-full justify-start bg-secondary">
                    Code Reviewer
                  </Button>
                </Link>
                <Link href="/cover-gen">
                  <Button variant="ghost" className="w-full justify-start bg-secondary">
                    Cover Page/Letter
                  </Button>
                </Link>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/pricing">
                  <Button variant="ghost" className="w-full justify-start bg-secondary">
                    Pricing
                  </Button>
                </Link>
                <Link href="/terms-and-conditions">
                  <Button variant="ghost" className="w-full justify-start bg-secondary">
                    Terms and Conditions
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" className="w-full justify-start bg-secondary">
                    Contact Us
                  </Button>
                </Link>
                <Link href="/refund-policy">
                  <Button variant="ghost" className="w-full justify-start bg-secondary mb-2">
                    Refund Policy
                  </Button>
                </Link>
              </div>

              {/* Account Settings */}
              <div className="mt-4">
                <Link href="/handler/account-settings">
                  <div className="bg-secondary rounded-xl border-2 flex items-center p-4 space-x-4">
                    <div className="flex items-center space-x-4">
                      <UserButton />
                      <div className="w-px bg-gray-300 h-10" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">Account Settings</span>
                      <span className="text-sm text-muted-foreground">Manage your settings</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <SheetFooter />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
