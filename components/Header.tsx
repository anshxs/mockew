"use client";

import { useState } from "react";
import { UserButton } from "@stackframe/stack";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/contact", label: "Contact Us" },
  { href: "/refund", label: "Refund Policy" },
];

export default function Header() {
  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
      <SparklesText className="text-xl font-extrabold">MOCKEW AI</SparklesText>

      {/* Desktop nav links */}
      <nav className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <UserButton />
      </nav>

      {/* Mobile menu */}
      <div className="flex md:hidden items-center space-x-2">
        <UserButton />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-6">
            <div className="flex flex-col space-y-4 mt-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-semibold text-gray-800 hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
