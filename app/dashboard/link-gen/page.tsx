'use client';

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, ExternalLink, Trash2 } from "lucide-react"
import Image from "next/image"
import { useUser } from "@stackframe/stack"

interface LinkData {
  id?: string
  user_id: string
  name: string
  bio: string
  profile_image: string
  background_color: string
  text_color: string
  template: string
  social_links: any[]
  custom_links: any[]
  created_at?: string
  updated_at?: string
}

export default function Dashboard() {
  const user = useUser()
  const userId = user?.id || ""
  const [userLinks, setUserLinks] = useState<LinkData[]>([])
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const loadUserLinks = async () => {
    if (!userId.trim()) return

    setLoading(true)
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single()

      if (profileError || !profileData) {
        setPlan('Free') // fallback if profile fetch fails
        setLoading(false)
        return
      }

      setPlan(profileData.plan)

      if (profileData.plan !== 'Free') {
        const { data, error } = await supabase
          .from("links")
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false })

        if (error) throw error
        setUserLinks(data || [])
      }
    } catch (error) {
      console.error("Error loading links:", error)
      toast({
        title: "Error",
        description: "Failed to load your links. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase.from("links").delete().eq("id", linkId)

      if (error) throw error

      setUserLinks(userLinks.filter((link) => link.id !== linkId))
      toast({
        title: "Success",
        description: "Link deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting link:", error)
      toast({
        title: "Error",
        description: "Failed to delete link. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (userId.trim()) {
      loadUserLinks()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading your links...</p>
      </div>
    )
  }

  if (plan === 'Free') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <Button onClick={() => router.push('/pricing')} className="mb-6">
          Upgrade Plan
        </Button>
        <h2 className="text-2xl font-bold mb-4">You're on the Free Plan</h2>
        <p className="text-muted-foreground">
          Upgrade your plan to unlock LinkDance and start sharing your custom link page.
        </p>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-row justify-between mb-8">
        <h1 className="text-3xl font-bold">LinkDance</h1>
        <div className="flex justify-end">
          <Button
            onClick={async () => {
              
              const { data: profileData, error: fetchExpError } = await supabase
                .from("profiles")
                .select("experience")
                .eq("id", user?.id)
                .single();

              if (fetchExpError) {
                console.error("Failed to fetch latest experience:", fetchExpError);
                return;
              }

              const newExperience = (profileData?.experience ?? 0) + 10;

              const { error: experror } = await supabase
                .from("profiles")
                .update({ experience: newExperience })
                .eq("id", user?.id);

              if (experror) {
                console.error("Failed to update experience:", experror);
                return;
              }
              router.push(`/dashboard/link-gen/editor?userId=${userId}`);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Link
          </Button>
        </div>
      </div>

      {userLinks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't created any links yet.</p>
          <Button
            onClick={async () => {
              
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
              router.push(`/dashboard/link-gen/editor?userId=${userId}`);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Link
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userLinks.map((link) => (
            <Card key={link.id} className="rounded-[30px] bg-[#f4f4f4]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {link.profile_image && (
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image
                        src={link.profile_image || "/placeholder.svg"}
                        alt={link.name || "Profile"}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{link.name || "Untitled Link"}</CardTitle>
                    <p className="text-sm text-muted-foreground truncate">{link.bio || "No description"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-muted-foreground">
                    Template: {link.template} • Created: {new Date(link.created_at!).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Social Links: {link.social_links?.filter((s: any) => s.username).length || 0} • Custom Links:{" "}
                    {link.custom_links?.length || 0}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/link-gen/editor?userId=${userId}&linkId=${link.id}`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(`/link/${link.id}`, "_blank")}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteLink(link.id!)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
