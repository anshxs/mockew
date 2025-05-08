"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";
import Link from "next/link";
import { DockDemo } from "@/components/DockDemo";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import { HeroVideoDialog } from "@/components/magicui/hero-video-dialog";
import { BentoDemo } from "@/components/BentoDemo";
import { AnimatedBeamDemo } from "@/components/Powered";
import { BlurFade } from "@/components/magicui/blur-fade";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  const router = useRouter();
  const shadowColor = "black";
  const goToDashboard = () => {
    router.push("/dashboard");
  };

  const faqs = [
  {
    question: "What makes Sensai unique as a career development tool?",
    answer:
      "Sensai combines AI-powered career tools with industry-specific insights to help you advance your career. Our platform offers three main features: an intelligent resume builder, a cover letter generator, and an adaptive interview preparation system. Each tool is tailored to your industry and skills, providing personalized guidance for your professional journey.",
  },
  {
    question: "How does Sensai create tailored content?",
    answer:
      "Sensai learns about your industry, experience, and skills during onboarding. It then uses this information to generate customized resumes, cover letters, and interview questions. The content is specifically aligned with your professional background and industry standards, making it highly relevant and effective.",
  },
  {
    question: "How accurate and up-to-date are Sensai's industry insights?",
    answer:
      "We update our industry insights weekly using advanced AI analysis of current market trends. This includes salary data, in-demand skills, and industry growth patterns. Our system constantly evolves to ensure you have the most relevant information for your career decisions.",
  },
  {
    question: "Is my data secure with Sensai?",
    answer:
      "Absolutely. We prioritize the security of your professional information. All data is encrypted and securely stored using industry-standard practices. We use Clerk for authentication and never share your personal information with third parties.",
  },
  {
    question: "How can I track my interview preparation progress?",
    answer:
      "Sensai tracks your performance across multiple practice interviews, providing detailed analytics and improvement suggestions. You can view your progress over time, identify areas for improvement, and receive AI-generated tips to enhance your interview skills based on your responses.",
  },
  {
    question: "Can I edit the AI-generated content?",
    answer:
      "Yes! While Sensai generates high-quality initial content, you have full control to edit and customize all generated resumes, cover letters, and other content. Our markdown editor makes it easy to refine the content to perfectly match your needs.",
  },
];


  return (
    
    <div className="grid items-center justify-items-center min-h-screen px-8 py-8 pb-20 max-w-screen gap-16 md:px-20 font-[family-name:var(--font-geist-sans)]">
      <BlurFade>
      <main className="flex flex-col gap-[32px] items-center justify-center">
      
      <div onClick={goToDashboard} className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
        
      <span
        className={cn(
          "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]",
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
      <AnimatedGradientText className="text-sm font-medium">
        Introducing Mockew AI
      </AnimatedGradientText>
      <ChevronRight
        className="ml-1 size-4 stroke-neutral-500 transition-transform
 duration-300 ease-in-out group-hover:translate-x-0.5"
      />
    </div>
    <h1 
      className="text-5xl font-extrabold text-center"><AnimatedGradientText
      speed={2}
    >
      MOCKEW AI
    </AnimatedGradientText> - INTERVIEW PAIN SIMULATOR</h1>
    <p className="text-lg">Congrats on being smart enough to choose Mockew. now prove it - watch the demo video before clicking random buttons like a maniac.</p>
    <div className="relative z-0 mb-40">
    <div className="absolute inset-0 z-[-1] rounded-2xl p-[2px] bg-[linear-gradient(to_right,_red,_orange,_yellow,_green,_blue,_indigo,_violet)] blur-md" />
      
    <div className="relative rounded-4xl bg-white p-6 shadow-lg">
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
    </div>
    
    <BentoDemo />
    <AnimatedBeamDemo/>
    <h1 className="text-balance text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl mb-10">
      First Interview {" "}
      <LineShadowText className="italic" shadowColor={shadowColor}>
        Free
      </LineShadowText>
    </h1>
        <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
        <DockDemo/>
      
    
    
    
      </main>
      <footer>
      <div className="size-full max-w-lg items-center justify-center overflow-hidden pt-8">
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <p className="text-[3.5rem] font-semibold">
          Mockew AI<span className="text-[#5046e6]">.</span>
        </p>
      </BoxReveal>
 
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <h2 className="mt-[.5rem] text-[1rem]">
          Interview Pain Simulator for{" "}
          <span className="text-[#5046e6]">Developers</span>
        </h2>
      </BoxReveal>
 
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <div className="mt-6">
          <p>
            -&gt; ai mock interview agent built with
            <span className="font-semibold text-[#5046e6]">NextJS</span>,
            <span className="font-semibold text-[#5046e6]">Typescript</span>,
            <span className="font-semibold text-[#5046e6]">Tailwind CSS</span>,
            and
            <span className="font-semibold text-[#5046e6]">Motion</span>
            . <br />
            -&gt; Mockew AI, because you are not ready <br />
          </p>
        </div>
      </BoxReveal>
 
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
      <Link className="mt-40" href="/dashboard">
      <InteractiveHoverButton >Get Started</InteractiveHoverButton>
      </Link>
      </BoxReveal>
    </div>
    </footer>
      
      </BlurFade>
      
    </div>
  );
}
