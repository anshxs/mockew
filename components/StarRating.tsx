"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
}

export function StarRating({ rating, onRatingChange }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="text-yellow-400 hover:text-yellow-500 transition-colors"
        >
          <Star className={cn("w-5 h-5", star <= rating ? "fill-current" : "stroke-current fill-transparent")} />
        </button>
      ))}
    </div>
  )
}
