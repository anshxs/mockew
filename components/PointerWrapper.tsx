"use client";
import { useEffect, useState } from "react";
import { Pointer } from "@/components/magicui/pointer";

export default function PointerWrapper({ className }: { className?: string }) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Tailwind 'lg' breakpoint
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isLargeScreen ? <Pointer className={className} /> : null;
}
