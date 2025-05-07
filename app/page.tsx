"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";
import Link from "next/link";
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

export default function Home() {
  const router = useRouter();
  const shadowColor = "black";
  const goToDashboard = () => {
    router.push("/dashboard");
  };


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
