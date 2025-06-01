// app/about/page.tsx (for App Router) or pages/about.tsx (for Pages Router)

import React from "react";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">About Us</h1>

      <p className="text-lg text-gray-700 mb-8">
        Welcome to <span className="font-semibold text-black">Mockew AI</span> – a product proudly built under{" "}
        <span className="font-semibold text-black">BluFalc</span>.
      </p>

      <div className="rounded-2xl text-left">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">👋 Meet the Creator</h2>
        <p className="text-gray-700 mb-4">
          Hey! I'm <span className="font-medium text-black">Ansh Sharma</span>, a 17-year-old aspiring software developer from India.
          I started BluFalc with a vision to build smart, helpful tools that empower developers like myself — and
          <span className="font-medium text-black"> Mockew AI</span> is my first step toward that dream.
        </p>

        <p className="text-gray-700 mb-4">
          I'm passionate about technology, self-taught programming, and creating platforms that make a difference. 
          Whether it's acing interviews with AI, building a resume, or sharing code with the community — Mockew AI brings it all together.
        </p>

        <p className="text-gray-700 mb-4">
          I may be working solo on this journey, but I’m incredibly thankful for the encouragement and belief from my biggest supporter — 
          <span className="font-medium text-black"> my father</span>. His support fuels my drive to keep learning and building.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">📌 About BluFalc</h2>
        <p className="text-gray-700">
          <span className="font-semibold text-black">BluFalc</span> is the indie software studio behind Mockew AI — a one-man tech lab focused on shipping creative, useful, and developer-first products.
          It’s not a big company (yet), but it’s big on ambition.
        </p>
      </div>

      <div className="mt-10">
        <p className="text-sm text-gray-500">Made with ❤️ by Ansh Sharma · © {new Date().getFullYear()} BluFalc</p>
      </div>
    </main>
  );
}
