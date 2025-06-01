"use client";

import OnBoardMain from "@/components/OnBoardMain";
import OnBoardFooter from "@/components/OnBoardFooter";
import Header from "@/components/Header"; // Make sure this is imported
import React, { useEffect, useRef, useState } from "react";
import supabase from "@/lib/supabase";

type Announcement = {
  id: string;
  message: string;
};

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [shouldScroll, setShouldScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("id, message")
        .order("created_at", { ascending: false });

      if (!error) {
        setAnnouncements(data);
      } else {
        setAnnouncements([]);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (containerRef.current && contentRef.current && announcements && announcements.length > 0) {
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      setShouldScroll(contentWidth > containerWidth);
    }
  }, [announcements]);

  const fallbackText = "🚀 Welcome to MOCKEW AI – Helping Devs Crack Interviews with AI Tools!";


  
  return (
    <div className="-mt-6">
      {/* Blue Scrollable Bar */}
      <div
      className="w-full bg-blue-600 text-white text-sm px-6 py-2 overflow-hidden"
      ref={containerRef}
    >
      {announcements && announcements.length > 0 ? (
        <div
          className={`flex gap-12 ${shouldScroll ? "whitespace-nowrap animate-marquee" : "justify-center flex-wrap text-center"}`}
          ref={contentRef}
        >🚀 
          {announcements.map((a) => (
            <span key={a.id}>{a.message}</span>
          ))}
        </div>
      ) : (
        <div className="text-center">{fallbackText}</div>
      )}
    </div>

      {/* Sticky Header */}
      <Header />

      {/* Main Content */}
      <div className="grid items-center justify-items-center min-h-screen px-8 py-8 pb-20 max-w-screen gap-16 md:px-20 font-[family-name:var(--font-geist-sans)] pt-[60px]">
        <main className="flex flex-col gap-[32px] items-center justify-center">
          <OnBoardMain />
        </main>
        <footer>
          <OnBoardFooter />
          
        </footer>
        <div className='flex mt-14 w-full justify-between -mb-14 font-medium'>
      <div>
        <a href="/">Mockew AI</a>
      </div>
      <div className='flex gap-6'>
        <a href="/contact">Contact Us</a>
        <a href="/about">About Us</a>
      </div>
    </div>
      </div>
    </div>
  );
}
