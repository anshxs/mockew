"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IdeaCard } from "@/components/idea-card"
import { Flame, Star, Trophy } from "lucide-react"
import { supabase, type Idea } from "@/lib/supabase"

export function IdeaTabs() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase.from("ideas").select("*").order("votes", { ascending: false })

      if (error) {
        console.error("Error fetching ideas:", error)
      } else {
        // Add rank based on votes
        const rankedIdeas = data.map((idea, index) => ({
          ...idea,
          rank: index + 1,
        }))
        setIdeas(rankedIdeas)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateIdeaVotes = (ideaId: number, newVotes: number) => {
    setIdeas((prevIdeas) =>
      prevIdeas
        .map((idea) => (idea.id === ideaId ? { ...idea, votes: newVotes } : idea))
        .sort((a, b) => b.votes - a.votes)
        .map((idea, index) => ({ ...idea, rank: index + 1 })),
    )
  }

  if (loading) {
    return (
      <div className="w-[360px] md:w-[460px] flex justify-center items-center h-64">
        <div className="text-lg">Loading ideas...</div>
      </div>
    )
  }

  const top20Ideas = ideas.slice(0, 20)
  const hotIdeas = ideas.filter((idea) => idea.votes > 50).slice(0, 20)

  return (
    <Tabs defaultValue="new" className="w-[360px] md:w-[460px]">
      <TabsList className="grid w-[360px] md:w-[460px] grid-cols-3 mb-8 bg-gray-200">
        <TabsTrigger value="hot" className="flex items-center gap-2">
          <Flame className="w-4 h-4" />
          Hot
        </TabsTrigger>
        <TabsTrigger value="new" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          New
        </TabsTrigger>
        <TabsTrigger value="top" className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Top
        </TabsTrigger>
      </TabsList>

      <TabsContent value="hot" className="space-y-4">
        <div className="grid gap-4 grid-cols-1">
          {hotIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onVoteUpdate={updateIdeaVotes} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="new" className="space-y-4">
        <div className="grid gap-4 grid-cols-1">
          {ideas
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onVoteUpdate={updateIdeaVotes} />
            ))}
        </div>
      </TabsContent>

      <TabsContent value="top" className="space-y-4">
        <div className="grid gap-4 grid-cols-1">
          {top20Ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onVoteUpdate={updateIdeaVotes} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
