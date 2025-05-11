"use client";

import OnBoardMain from "@/components/OnBoardMain";
import OnBoardFooter from "@/components/OnBoardFooter";
import React from "react";

export default function Home() {

  return (
    <div className="grid items-center justify-items-center min-h-screen px-8 py-8 pb-20 max-w-screen gap-16 md:px-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center justify-center">
        <OnBoardMain />
      </main>
      <footer>
        <OnBoardFooter />
      </footer>
    </div>
  );
}
