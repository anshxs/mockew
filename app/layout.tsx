import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import "./globals.css";
import Header from "@/components/Header"; // path depends on your file structure
import { Jost } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import FloatingFeedback from "@/components/FloatingFeedback";
import Script from "next/script";

export const myFont = Jost({
  subsets: ['latin'],
  weight: ['400','500','700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Mockew AI – Developer Toolkit for Careers & Creativity",
  description: "Mockew AI offers AI mock interviews, a dev social feed, resume builder, code reviewer, and more — all in one platform for modern developers.",
  keywords: [
    "Mockew AI",
    "AI mock interview",
    "developer tools",
    "resume builder for developers",
    "debug feed",
    "developer social network",
    "code to image",
    "linktree for developers",
    "code reviewer",
    "tech interview prep"
  ],
  authors: [{ name: "Ansh", url: "https://mockew.ai" }],
  creator: "Mockew AI",
  publisher: "Mockew AI",
  metadataBase: new URL("https://mockew.ai"),
  openGraph: {
    title: "Mockew AI – Developer Toolkit for Careers & Creativity",
    description:
      "Mockew AI helps developers ace interviews, build resumes, get feedback, and showcase their work with one powerful AI-driven platform.",
    url: "https://mockew.ai",
    siteName: "Mockew AI",
    images: [
      {
        url: "https://raw.githubusercontent.com/anshxs/mocked/refs/heads/main/MOCKEW.png",
        width: 1200,
        height: 630,
        alt: "Mockew AI Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mockew AI – Developer Toolkit for Careers & Creativity",
    description:
      "One platform for AI mock interviews, resume building, code reviews, and more. Built for devs who ship.",
    images: [
      "https://raw.githubusercontent.com/anshxs/mocked/refs/heads/main/MOCKEW.png",
    ],
    creator: "@yourTwitterHandle", // Replace with real handle if available
  },
  icons: {
    icon: "https://raw.githubusercontent.com/anshxs/mocked/refs/heads/main/MOCKEW.png",
    shortcut: "https://raw.githubusercontent.com/anshxs/mocked/refs/heads/main/MOCKEW.png",
    apple: "https://raw.githubusercontent.com/anshxs/mocked/refs/heads/main/MOCKEW.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-jost">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-jost">

        <StackProvider app={stackServerApp}>
          <StackTheme>
            <div className="relative min-h-screen overflow-hidden">
              {/* Background Pattern */}
              <div className="fixed inset-0 -z-10">
                <div
                  className="absolute top-1/3 left-1/3 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-br from-pink-400 via-[#39caff] to-[#4dff68] opacity-70 blur-3xl"
                  aria-hidden="true"
                />
              </div>

              {/* Foreground Content */}
              <Header />
              <main className="pt-12 md:pt-20 ">
                {children}
                <FloatingFeedback/>
                <Toaster />
              </main>
            </div>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
