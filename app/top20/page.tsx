"use client"
import { FloatingDock } from "@/components/floating-dock"
import { IdeaTabs } from "@/components/idea-tabs"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-secondary">
      <FloatingDock />

      <div className="pt-24 pb-8 mx-auto flex flex-col w-[300px] md:w-[460px] items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Top 20 Ideas</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most innovative startup ideas from our community. Vote, share, and get inspired!
          </p>
        </div>

        <IdeaTabs />
      </div>
    </div>
  )
}
