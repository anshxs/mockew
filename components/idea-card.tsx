"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase, type Idea } from "@/lib/supabase"
import { getUserIdentifier } from "@/lib/utils/user-identifier"
import { useUser } from "@stackframe/stack"

interface IdeaCardProps {
  idea: Idea
  onVoteUpdate: (ideaId: number, newVotes: number) => void
}

export function IdeaCard({ idea, onVoteUpdate }: IdeaCardProps) {
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    checkUserVote()
  }, [idea.id])

  const checkUserVote = async () => {
    try {
        const userIdentifier = getUserIdentifier()
      const { data, error } = await supabase
        .from("votes")
        .select("vote_type")
        .eq("idea_id", idea.id)
        .eq("user_identifier", userIdentifier)
        .single()

      if (data && !error) {
        setUserVote(data.vote_type as "up" | "down")
      }
    } catch (error) {
      // No existing vote found, which is fine
    }
  }

  const handleVote = async (voteType: "up" | "down") => {
    if (isVoting) return

    setIsVoting(true)
    try {
      const userIdentifier = getUserIdentifier()

      if (userVote === voteType) {
        // Remove vote
        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("idea_id", idea.id)
          .eq("user_identifier", userIdentifier)

        if (!deleteError) {
          const newVotes = voteType === "up" ? idea.votes - 1 : idea.votes + 1

          // Update idea votes count
          const { error: updateError } = await supabase.from("ideas").update({ votes: newVotes }).eq("id", idea.id)

          if (!updateError) {
            setUserVote(null)
            onVoteUpdate(idea.id, newVotes)
          }
        }
      } else {
        // Add or change vote
        const { error: upsertError } = await supabase.from("votes").upsert({
          idea_id: idea.id,
          user_identifier: userIdentifier,
          vote_type: voteType,
        })

        if (!upsertError) {
          let newVotes = idea.votes

          if (userVote === null) {
            // First vote
            newVotes = voteType === "up" ? idea.votes + 1 : idea.votes - 1
          } else {
            // Changing vote
            newVotes = voteType === "up" ? idea.votes + 2 : idea.votes - 2
          }

          // Update idea votes count
          const { error: updateError } = await supabase.from("ideas").update({ votes: newVotes }).eq("id", idea.id)

          if (!updateError) {
            setUserVote(voteType)
            onVoteUpdate(idea.id, newVotes)
          }
        }
      }
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full">
                #{idea.rank}
              </span>
            </div>
            <p className="text-gray-900 font-medium leading-relaxed mb-4">{idea.idea}</p>
            <p className="text-sm text-gray-500">
              By @{idea.username} on {new Date(idea.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 ml-4">
            <Button
              variant={userVote === "up" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleVote("up")}
              disabled={isVoting}
              className="p-1 h-8 w-8"
            >
              👍
            </Button>

            <span className="text-lg font-bold text-gray-900 min-w-[3ch] text-center">{idea.votes}</span>

            <Button
              variant={userVote === "down" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleVote("down")}
              disabled={isVoting}
              className="p-1 h-8 w-8"
            >
              👎
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
