"use client";
import { UserButton } from "@stackframe/stack";

export default function Header() {
  return (
    <header className="w-full fixed top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">MOCKEW</h1>
      <UserButton />
    </header>
  );
}
