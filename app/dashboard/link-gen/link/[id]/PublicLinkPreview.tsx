import type React from "react"
import Image from "next/image"
import { Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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

interface Props {
  linkData: LinkData
  getSocialIcon: (platform: string) => React.ReactNode
}

export default function PublicLinkPreview({ linkData, getSocialIcon }: Props) {
  const { template, name, bio, profile_image, social_links, custom_links } = linkData

  if (template === "card") {
    return (
      <div className="flex flex-col items-center max-w-md mx-auto">
        {profile_image && (
          <div className="relative h-24 w-24 mb-4">
            <Image
              src={profile_image || "/placeholder.svg"}
              alt={name || "Profile"}
              fill
              className="object-cover rounded-full"
            />
          </div>
        )}

        {name && <h1 className="text-2xl font-bold text-center mb-2">{name}</h1>}
        {bio && <p className="text-center mb-6">{bio}</p>}

        {/* Social Links */}
        {social_links?.some((link: any) => link.username) && (
          <div className="flex justify-center gap-4 mb-6">
            {social_links
              ?.filter((link: any) => link.username)
              .map((link: any, index: number) => (
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
          {custom_links?.map((link: any) => (
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
          {profile_image && (
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image
                src={profile_image || "/placeholder.svg"}
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
        {social_links?.some((link: any) => link.username) && (
          <div className="flex flex-wrap gap-3 mb-6">
            {social_links
              ?.filter((link: any) => link.username)
              .map((link: any, index: number) => (
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
          {custom_links?.map((link: any) => (
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
      {profile_image && (
        <div className="flex justify-center mb-4">
          <div className="relative h-16 w-16">
            <Image
              src={profile_image || "/placeholder.svg"}
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
        {custom_links?.map((link: any) => (
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
      {social_links?.some((link: any) => link.username) && (
        <div className="flex justify-center gap-3 mt-6">
          {social_links
            ?.filter((link: any) => link.username)
            .map((link: any, index: number) => (
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
