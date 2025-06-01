"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FloatingDock } from "@/components/floating-dock"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@stackframe/stack"

export default function NewIdeaPage() {
  const router = useRouter()
  const user = useUser()
  const [idea, setIdea] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.primaryEmail) {
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("email", user.primaryEmail)
          .single()

        if (error) {
          console.error("Error fetching username:", error)
        } else {
          setUsername(data.username)
        }
      }
    }

    fetchUsername()
  }, [user?.primaryEmail])

  const handleSubmit = async () => {
    if (!idea.trim() || isSubmitting || !user?.id) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("ideas").insert({
        idea: idea.trim(),
        username: username ?? `user_${user.id.slice(-6)}`, // fallback if username not found
        user_id: user.id,
        votes: 0,
        rank: null,
      })

      const { data: profileData, error: fetchExpError } = await supabase
            .from("profiles")
            .select("experience")
            .eq("id", user?.id)
            .single();
      
          if (fetchExpError) {
            console.error("Failed to fetch latest experience:", fetchExpError);
            return;
          }
      
          const newExperience = (profileData?.experience ?? 0) + 5;
      
          const { error: experror } = await supabase
            .from("profiles")
            .update({ experience: newExperience })
            .eq("id", user?.id);
      
          if (experror) {
            console.error("Failed to update experience:", experror);
            return;
          }

      if (error) {
        console.error("Error submitting idea:", error)
        alert("Failed to submit idea. Please try again.")
      } else {
        setIdea("")
        router.push("/top20")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to submit idea. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <FloatingDock />
      <div className="pt-24 pb-8 w-[360px] md:w-[460px] mx-auto">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between">
                <h3>Your Idea</h3>
                <Button onClick={handleSubmit} disabled={!idea.trim() || isSubmitting} className="flex items-center">
                  <Send className="w-5 h-5 mr-1" />
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share your innovative startup idea here..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-[100px] text-lg mb-4"
              disabled={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
