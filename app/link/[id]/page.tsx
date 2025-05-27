"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Facebook, Github, Instagram, Linkedin, Twitter, Youtube, Globe } from "lucide-react"
import PublicLinkPreview from "./PublicLinkPreview" // Import the PublicLinkPreview component

interface LinkData {
  id: string
  user_id: string
  name: string
  bio: string
  profile_image: string
  background_color: string
  text_color: string
  template: string
  social_links: any[]
  custom_links: any[]
}

export default function LinkPage() {
  const params = useParams()
  const linkId = params.id as string
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  

  useEffect(() => {
    loadLinkData()
  }, [linkId])

  const loadLinkData = async () => {
    try {
      const { data, error } = await supabase.from("links").select("*").eq("id", linkId).single()

      if (error) throw error

      setLinkData(data)
    } catch (error) {
      console.error("Error loading link data:", error)
      setError("Link not found or failed to load.")
    } finally {
      setLoading(false)
    }
  }

  // Get social icon component
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-5 w-5" />
      case "twitter":
        return <Twitter className="h-5 w-5" />
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "github":
        return <Github className="h-5 w-5" />
      case "youtube":
        return <Youtube className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  if (error || !linkData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Link Not Found</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        backgroundColor: linkData.background_color,
        color: linkData.text_color,
      }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="container mx-auto max-w-md z-60">
        <PublicLinkPreview linkData={linkData} getSocialIcon={getSocialIcon} />
      </div>
    </main>
  )
}
