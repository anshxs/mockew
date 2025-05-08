"use client";

import { UserButton } from "@stackframe/stack";
import { useUser } from "@stackframe/stack";
import { SparklesText } from "@/components/magicui/sparkles-text";
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

export default function Header() {
  const user = useUser();

  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
      <SparklesText className="text-xl font-extrabold">MOCKEW AI</SparklesText>
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
              <SheetTitle className="text-lg">Menu</SheetTitle>
            </SheetHeader>

            <div className="mt-4 flex flex-col gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start bg-secondary">
                  Dashboard
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" className="w-full justify-start bg-secondary">
                  Pricing
                </Button>
              </Link>
              <Link href="/terms">
                <Button variant="ghost" className="w-full justify-start bg-secondary">
                  Terms and Conditions
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="w-full justify-start bg-secondary">
                  Contact Us
                </Button>
              </Link>
              <Link href="/refund">
                <Button variant="ghost" className="w-full justify-start bg-secondary mb-2">
                  Refund Policy
                </Button>
              </Link>

              <Link href="/handler/account-settings">
                <div className="bg-secondary rounded-xl border-2 flex items-center p-4 space-x-4">
                  <div className="flex items-center space-x-4">
                    <UserButton />
                    <div className="w-px bg-gray-300 h-10" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                      {user?.displayName ?? "Sign In"}
                    </span>
                    {user?.displayName && user.primaryEmail && (
                      <span className="text-sm text-muted-foreground">
                        {user.primaryEmail}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>

            <SheetFooter />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
