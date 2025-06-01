"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function FloatingDock() {
  const router = useRouter()

  return (
    <div className="fixed w-[360px] md:w-[460px] top-4 left-1/2 transform -translate-x-1/2 pt-12">
      <div className="bg-white/50 border-2 backdrop-blur-md rounded-3xl p-3 ">
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto gap-16">
          <div className="text-lg font-semibold text-gray-900">Top 20 Ideas</div>

          <Button onClick={() => router.push("/dashboard/new")} className="flex items-center gap-2 rounded-xl px-4 py-2">
            <Plus className="w-4 h-4" />
            New Idea
          </Button>
        </div>
      </div>
    </div>
  )
}
