"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const clockRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(new Date());
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!clockRef.current || animated) return;
      const rect = clockRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setAnimated(true);
        setTimeout(() => {
          setTime(new Date());
        }, 2000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animated]);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (360 / 12) * hours + (30 / 60) * minutes;
  const minuteDeg = (360 / 60) * minutes + (6 / 60) * seconds;
  const secondDeg = (360 / 60) * seconds;

  return (
    <footer className="bg-black text-white px-6 md:px-20 flex flex-col min-h-[500px]">
      {/* Main content */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-center flex-grow py-16 gap-10">
        {/* Clock */}
        <div
          ref={clockRef}
          className="relative w-48 h-48 rounded-full border-4 border-white flex items-center justify-center"
        >
          <div
            className={`absolute w-1 h-20 bg-white origin-bottom transition-transform duration-700 ease-out ${
              animated ? "rotate-[3600deg]" : ""
            }`}
            style={{ transform: `rotate(${hourDeg}deg)` }}
          />
          <div
            className={`absolute w-0.5 h-24 bg-white origin-bottom transition-transform duration-700 ease-out ${
              animated ? "rotate-[3600deg]" : ""
            }`}
            style={{ transform: `rotate(${minuteDeg}deg)` }}
          />
          <div
            className={`absolute w-[2px] h-28 bg-red-500 origin-bottom transition-transform duration-700 ease-out ${
              animated ? "rotate-[3600deg]" : ""
            }`}
            style={{ transform: `rotate(${secondDeg}deg)` }}
          />
        </div>

        {/* Text */}
        <div className="text-center md:text-right space-y-6 max-w-md">
          <h2 className="text-4xl font-bold">Join the Movement</h2>
          <p className="text-gray-300 text-lg">
            Unlock the future of productivity with{" "}
            <span className="text-white font-bold">Huly</span>.<br />
            Remember, this journey is just getting started.
          </p>
          <div className="flex justify-center md:justify-end gap-4">
            <Button variant="default" className="text-lg px-6 py-3">Get Started</Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black text-lg px-6 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom nav bar */}
      <div className="border-t border-gray-800 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Huly. All rights reserved.</p>
        <nav className="flex gap-4 mt-2 md:mt-0">
          <a href="/about" className="hover:text-white">About</a>
          <a href="/features" className="hover:text-white">Features</a>
          <a href="/pricing" className="hover:text-white">Pricing</a>
          <a href="/contact" className="hover:text-white">Contact</a>
        </nav>
      </div>
    </footer>
  );
};
