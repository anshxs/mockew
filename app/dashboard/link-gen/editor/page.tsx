"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react"
import { ExternalLink } from "lucide-react" // Declare the ExternalLink variable

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { useUser } from "@stackframe/stack"


// Types
interface SocialLink {
  platform: string
  username: string
}

interface CustomLink {
  id: string
  title: string
  url: string
  icon: string
}

interface UserData {
  id?: string
  user_id: string
  name: string
  bio: string
  profileImage: string
  backgroundColor: string
  textColor: string
  template: string
  socialLinks: SocialLink[]
  customLinks: CustomLink[]
}

// Initial data
const getInitialData = (userId: string, profileImage: string = ""): UserData => ({
  user_id: userId,
  name: "",
  bio: "",
  profileImage: profileImage,
  backgroundColor: "#ffffff",
  textColor: "#000000",
  template: "card",
  socialLinks: [
    { platform: "instagram", username: "" },
    { platform: "twitter", username: "" },
    { platform: "facebook", username: "" },
  ],
  customLinks: [],
})


export default function Editor() {
  const user = useUser()
  const searchParams = useSearchParams()
  const userId = user?.id || ""
  const linkId = searchParams.get("linkId")
  const [shortUrl, setShortUrl] = useState("");
  const [userData, setUserData] = useState<UserData>(getInitialData(userId, user?.profileImageUrl || ""))
  const [showPreview, setShowPreview] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const generateTinyUrl = async () => {
      if (!userData.id) return;

      const fullUrl = `${window.location.origin}/link/${userData.id}`;
      try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(fullUrl)}`);
        const tinyUrl = await response.text();
        setShortUrl(tinyUrl);
      } catch (error) {
        console.error("Error generating shortened URL:", error);
      }
    };

    generateTinyUrl();
  }, [userData.id]);

  // Load existing link data if editing
  useEffect(() => {
    if (linkId) {
      loadLinkData()
    } else if (userId) {
      // Load from localStorage for new links
      const savedData = localStorage.getItem(`linktreeData_${userId}`)
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setUserData({ ...parsed, user_id: userId })
        } catch (error) {
          console.error("Error parsing saved data:", error)
        }
      }
    }
  }, [linkId, userId])

  // Save to localStorage whenever userData changes (for new links only)
  useEffect(() => {
    if (!linkId && userId) {
      localStorage.setItem(`linktreeData_${userId}`, JSON.stringify(userData))
    }
  }, [userData, linkId, userId])

  // Load link data from Supabase
  const loadLinkData = async () => {
    if (!linkId) return

    setLoading(true)
    try {
      const { data, error } = await supabase.from("links").select("*").eq("id", linkId).single()

      if (error) throw error

      if (data) {
        setUserData({
          id: data.id,
          user_id: data.user_id,
          name: data.name || "",
          bio: data.bio || "",
          profileImage: data.profile_image || "",
          backgroundColor: data.background_color || "#ffffff",
          textColor: data.text_color || "#000000",
          template: data.template || "card",
          socialLinks: data.social_links || [],
          customLinks: data.custom_links || [],
        })
      }
    } catch (error) {
      console.error("Error loading link data:", error)
      toast({
        title: "Error",
        description: "Failed to load link data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle image upload or URL input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUserData({ ...userData, profileImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle image URL input
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, profileImage: e.target.value })
  }

  // Handle social link changes
  const handleSocialLinkChange = (platform: string, username: string) => {
    const updatedSocialLinks = userData.socialLinks.map((link) =>
      link.platform === platform ? { ...link, username } : link,
    )
    setUserData({ ...userData, socialLinks: updatedSocialLinks })
  }

  // Add custom link
  const addCustomLink = () => {
    const newLink: CustomLink = {
      id: Date.now().toString(),
      title: "",
      url: "",
      icon: "",
    }
    setUserData({
      ...userData,
      customLinks: [...userData.customLinks, newLink],
    })
  }

  // Update custom link
  const updateCustomLink = (id: string, field: keyof CustomLink, value: string) => {
    const updatedLinks = userData.customLinks.map((link) => (link.id === id ? { ...link, [field]: value } : link))
    setUserData({ ...userData, customLinks: updatedLinks })
  }

  // Remove custom link
  const removeCustomLink = (id: string) => {
    const updatedLinks = userData.customLinks.filter((link) => link.id !== id)
    setUserData({ ...userData, customLinks: updatedLinks })
  }

  // Handle publish/update
  const handlePublish = async () => {
    if (!userId.trim()) {
      toast({
        title: "Error",
        description: "User ID is required to publish.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const linkData = {
        user_id: userData.user_id,
        name: userData.name,
        bio: userData.bio,
        profile_image: userData.profileImage,
        background_color: userData.backgroundColor,
        text_color: userData.textColor,
        template: userData.template,
        social_links: userData.socialLinks,
        custom_links: userData.customLinks,
        updated_at: new Date().toISOString(),
      }

      let result
      if (linkId) {
        // Update existing link
        result = await supabase.from("links").update(linkData).eq("id", linkId).select().single()
      } else {
        // Create new link
        result = await supabase.from("links").insert([linkData]).select().single()
      }

      if (result.error) throw result.error

      const generatedUrl = `${window.location.origin}/link/${result.data.id}`
      setPublishedUrl(generatedUrl)
      setShowPublishDialog(true)

      // Update userData with the new ID if it was a new link
      if (!linkId) {
        setUserData({ ...userData, id: result.data.id })
        // Clear localStorage for this user since it's now saved to Supabase
        localStorage.removeItem(`linktreeData_${userId}`)
      }

      toast({
        title: "Success",
        description: linkId ? "Link updated successfully!" : "Link published successfully!",
      })
    } catch (error) {
      console.error("Error publishing link:", error)
      toast({
        title: "Error",
        description: "Failed to publish link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publishedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      })
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

  if (loading && linkId) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12">
          <p>Loading link data...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to create or edit your link page.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-2 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Editor Section */}
        <div className={`${showPreview && !isMobile ? "lg:w-1/2" : "w-full"}`}>
          <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center gap-4">
      {/* <Button variant="outline" size="sm" onClick={() => router.push("/")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button> */}
      <div>
        <h1 className="text-2xl font-bold">{linkId ? "Edit Link Page" : "Create Your Link Page"}</h1>
        {userData.id && (
          <>
            <p className="text-sm text-muted-foreground mt-1">
              URL: {window.location.origin}/link/{userData.id}
            </p>
            {shortUrl && (
              <p className="text-sm text-muted-foreground mt-1">
                Short URL: <a href={shortUrl} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{shortUrl}</a>
              </p>
            )}
          </>
        )}
      </div>
    </div>
            {isMobile && (
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            )}
          </div>

          <Tabs defaultValue="profile">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={userData.bio}
                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                    placeholder="Tell something about yourself"
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Profile Image</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <label htmlFor="profile-image" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                          <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="image-url">Or paste image URL</Label>
                      <Input
                        id="image-url"
                        placeholder="https://example.com/image.jpg"
                        value={userData.profileImage.startsWith("data:") ? "" : userData.profileImage}
                        onChange={handleImageUrlChange}
                      />
                    </div>
                    {userData.profileImage && (
                      <div className="mt-2 relative h-20 w-20 mx-auto">
                        <Image
                          src={userData.profileImage || "/placeholder.svg"}
                          alt="Profile preview"
                          fill
                          className="object-cover rounded-full"
                          onError={() => {
                            toast({
                              title: "Image Error",
                              description: "Could not load the image. Please check the URL.",
                              variant: "destructive",
                            })
                            setUserData({ ...userData, profileImage: "" })
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-6">
              <div className="space-y-4">
                {userData.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 flex justify-center">{getSocialIcon(link.platform)}</div>
                    <Select
                      value={link.platform}
                      onValueChange={(value) => {
                        const updatedLinks = [...userData.socialLinks]
                        updatedLinks[index] = { ...updatedLinks[index], platform: value }
                        setUserData({ ...userData, socialLinks: updatedLinks })
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="github">GitHub</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={`Your ${link.platform} username`}
                      value={link.username}
                      onChange={(e) => handleSocialLinkChange(link.platform, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUserData({
                      ...userData,
                      socialLinks: [...userData.socialLinks, { platform: "instagram", username: "" }],
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
            </TabsContent>

            {/* Links Tab */}
            <TabsContent value="links" className="space-y-6">
              <div className="space-y-4">
                {userData.customLinks.map((link) => (
                  <div key={link.id} className="flex flex-col gap-2 p-4 border rounded-md">
                    <div className="flex justify-between">
                      <Label>Link Details</Label>
                      <Button variant="ghost" size="sm" onClick={() => removeCustomLink(link.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Link Title"
                      value={link.title}
                      onChange={(e) => updateCustomLink(link.id, "title", e.target.value)}
                    />
                    <Input
                      placeholder="URL (https://...)"
                      value={link.url}
                      onChange={(e) => updateCustomLink(link.id, "url", e.target.value)}
                    />
                    <Input
                      placeholder="Icon URL (optional)"
                      value={link.icon}
                      onChange={(e) => updateCustomLink(link.id, "icon", e.target.value)}
                    />
                    {link.icon && (
                      <div className="mt-2 relative h-8 w-8 mx-auto">
                        <Image
                          src={link.icon || "/placeholder.svg"}
                          alt="Icon preview"
                          fill
                          className="object-contain"
                          onError={() => {
                            toast({
                              title: "Icon Error",
                              description: "Could not load the icon. Please check the URL.",
                              variant: "destructive",
                            })
                            updateCustomLink(link.id, "icon", "")
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addCustomLink}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Link
                </Button>
              </div>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template">Template Style</Label>
                  <Select
                    value={userData.template}
                    onValueChange={(value) => setUserData({ ...userData, template: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="profile">Profile</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={userData.backgroundColor}
                      onChange={(e) => setUserData({ ...userData, backgroundColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={userData.backgroundColor}
                      onChange={(e) => setUserData({ ...userData, backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={userData.textColor}
                      onChange={(e) => setUserData({ ...userData, textColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={userData.textColor}
                      onChange={(e) => setUserData({ ...userData, textColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Button onClick={handlePublish} className="w-full" disabled={loading}>
              {loading ? "Publishing..." : linkId ? "Update Link Page" : "Publish Link Page"}
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        {(showPreview || !isMobile) && (
          <div className={`${!isMobile ? "lg:w-1/2" : "w-full"} mt-6 lg:mt-0`}>
            <div className="sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Preview</h2>
                {!isMobile && (
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                    {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                )}
              </div>

              <div className="border rounded-lg overflow-hidden h-[600px] max-h-[80vh] overflow-y-auto">
                <div
                  style={{
                    backgroundColor: userData.backgroundColor,
                    color: userData.textColor,
                  }}
                  className="min-h-full p-6"
                >
                  <LinkPreview userData={userData} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Publish Success Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎉 Link Published Successfully!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Your link page is now live and ready to share!</p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <Input value={publishedUrl} readOnly className="flex-1" />
              <Button size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.open(publishedUrl, "_blank")} className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Link
              </Button>
              <Button
                onClick={() => {
                  setShowPublishDialog(false)
                  router.push("/")
                }}
                className="flex-1"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

// Preview Component
function LinkPreview({ userData }: { userData: UserData }) {
  const { template, name, bio, profileImage, socialLinks, customLinks } = userData

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

  if (template === "card") {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto">
        {profileImage && (
          <div className="relative h-24 w-24 mb-4">
            <Image
              src={profileImage || "/placeholder.svg"}
              alt={name || "Profile"}
              fill
              className="object-cover rounded-full"
            />
          </div>
        )}

        {name && <h1 className="text-2xl font-bold text-center mb-2">{name}</h1>}
        {bio && <p className="text-center mb-6">{bio}</p>}

        {/* Social Links */}
        {socialLinks.some((link) => link.username) && (
          <div className="flex justify-center gap-4 mb-6">
            {socialLinks
              .filter((link) => link.username)
              .map((link, index) => (
                <a
                  key={index}
                  href={`https://${link.platform}.com/${link.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-black/10"
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
          </div>
        )}

        {/* Custom Links */}
        <div className="w-full space-y-3">
          {customLinks.map((link) => (
            <Card key={link.id} className="w-full">
              <CardContent className="p-3 flex items-center gap-3">
                {link.icon && (
                  <div className="relative h-6 w-6 flex-shrink-0">
                    <Image src={link.icon || "/placeholder.svg"} alt={link.title} fill className="object-contain" />
                  </div>
                )}
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center font-medium">
                  {link.title || link.url}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (template === "profile") {
    return (
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-6 mb-8">
          {profileImage && (
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt={name || "Profile"}
                fill
                className="object-cover rounded-full"
              />
            </div>
          )}
          <div>
            {name && <h1 className="text-2xl font-bold mb-1">{name}</h1>}
            {bio && <p className="text-sm">{bio}</p>}
          </div>
        </div>

        {/* Social Links */}
        {socialLinks.some((link) => link.username) && (
          <div className="flex flex-wrap gap-3 mb-6">
            {socialLinks
              .filter((link) => link.username)
              .map((link, index) => (
                <a
                  key={index}
                  href={`https://${link.platform}.com/${link.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/10 hover:bg-black/20"
                >
                  {getSocialIcon(link.platform)}
                  <span>{link.username}</span>
                </a>
              ))}
          </div>
        )}

        {/* Custom Links */}
        <div className="space-y-3">
          {customLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-black/5 w-full"
            >
              {link.icon && (
                <div className="relative h-6 w-6 flex-shrink-0">
                  <Image src={link.icon || "/placeholder.svg"} alt={link.title} fill className="object-contain" />
                </div>
              )}
              <span className="font-medium">{link.title || link.url}</span>
            </a>
          ))}
        </div>
      </div>
    )
  }

  // Minimal template
  return (
    <div className="max-w-md mx-auto">
      {profileImage && (
        <div className="flex justify-center mb-4">
          <div className="relative h-16 w-16">
            <Image
              src={profileImage || "/placeholder.svg"}
              alt={name || "Profile"}
              fill
              className="object-cover rounded-full"
            />
          </div>
        </div>
      )}

      {name && <h1 className="text-xl font-bold text-center mb-1">{name}</h1>}
      {bio && <p className="text-center text-sm mb-6">{bio}</p>}

      {/* Custom Links */}
      <div className="space-y-2">
        {customLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 border-b hover:bg-black/5 w-full"
          >
            <div className="flex items-center gap-2">
              {link.icon && (
                <div className="relative h-5 w-5 flex-shrink-0">
                  <Image src={link.icon || "/placeholder.svg"} alt={link.title} fill className="object-contain" />
                </div>
              )}
              <span>{link.title || link.url}</span>
            </div>
            <Globe className="h-4 w-4 opacity-50" />
          </a>
        ))}
      </div>

      {/* Social Links */}
      {socialLinks.some((link) => link.username) && (
        <div className="flex justify-center gap-3 mt-6">
          {socialLinks
            .filter((link) => link.username)
            .map((link, index) => (
              <a
                key={index}
                href={`https://${link.platform}.com/${link.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-black/10 rounded-full"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
        </div>
      )}
    </div>
  )
}
