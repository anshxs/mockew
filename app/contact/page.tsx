"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create mailto link with form data
    const mailtoLink = `mailto:anshsxa@gmail.com?subject=${encodeURIComponent(
      subject || "Contact Form Submission",
    )}&body=${encodeURIComponent(`Name: ${name}\n\n${message}`)}`

    // Open email client
    window.location.href = mailtoLink
  }

  return (
    <div className="flex justify-center">
    <div className="container px-4 md:px-6 py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            We'd love to hear from you. Please fill out the form below or use our contact information.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 w-full max-w-full">
        <Card className="w-full max-w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send us a message
            </CardTitle>
            <CardDescription>Your message will be sent to anshsxa@gmail.com</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Message subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message"
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="grid gap-8">
          <Card className="w-full max-w-full overflow-hidden">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Here are the ways you can reach us.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    RS Pura
                    <br />
                    Jammu, Jammu and Kashmir
                    <br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-sm text-muted-foreground">
                    <Link href="tel:+919876543210" className="hover:underline">
                      +91 98765 43210
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    <Link href="mailto:anshsxa@gmail.com" className="hover:underline">
                      anshsxa@gmail.com
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Building2 className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Business Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Monday - Saturday: 9:00 AM - 6:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-full overflow-hidden">
            <CardHeader>
              <CardTitle>Our Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full max-w-full h-[250px] rounded-md overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26911.35617162991!2d74.70961534648438!3d32.63682147532454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e84f3a1dc4f71%3A0x4a0c7e7986a4ac44!2sR%20S%20Pura%2C%20Jammu%20and%20Kashmir%20181102!5e0!3m2!1sen!2sin!4v1714984889148!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RS Pura, Jammu Map"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  )
}
