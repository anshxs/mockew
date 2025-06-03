import React from 'react'
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import { HeroVideoDialog } from "@/components/magicui/hero-video-dialog";
import { BentoDemo } from "@/components/BentoDemo";
import { AnimatedBeamDemo } from "@/components/Powered";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import PricingDemoUI from "@/components/PricingComponent"
import { useRouter } from "next/navigation";
import { TextAnimate } from './magicui/text-animate';
import { BlurFade } from './magicui/blur-fade';

function OnBoardMain() {
    const router = useRouter();
    const shadowColor = "black";
    const goToDashboard = () => {
        router.push("/dashboard");
    };

    const faqs = [
  {
    question: "What is Mockew AI?",
    answer:
      "Mockew AI is an all-in-one career and productivity platform for developers. It features an AI-powered mock interviewer, a collaborative Debug Feed, resume builder, code-to-image converter, and several other tools to help you grow, build, and stand out in the tech industry.",
  },
  {
    question: "How does the AI Mock Interviewer work?",
    answer:
      "The AI Mock Interviewer simulates real interview scenarios using natural language processing and adaptive question flow. It tailors each session to your skill level and role — whether you're applying for frontend, backend, or full-stack roles — and provides instant feedback to help you improve.",
  },
  {
    question: "What is the Debug Feed?",
    answer:
      "The Debug Feed is a social space where developers post coding problems, share solutions, and engage with the community. It's like Stack Overflow meets Twitter — designed to promote learning, collaboration, and visibility within the developer community.",
  },
  {
    question: "Can I build and export my resume with Mockew AI?",
    answer:
      "Yes. The resume builder in Mockew AI allows you to create beautifully formatted resumes tailored to your job goals. You can export in PDF format, update anytime, and even share it via your public profile.",
  },
  {
    question: "What is Linkdance?",
    answer:
      "Linkdance is a Linktree-style profile builder for developers. You can add your GitHub, portfolio, blog, social links, and even showcase your resume — all in a clean, developer-friendly layout.",
  },
  {
    question: "What does the Code Reviewer do?",
    answer:
      "The Code Reviewer uses AI to analyze your code for best practices, optimization, and potential bugs. It gives you constructive feedback and suggestions in seconds, helping you level up your coding game.",
  },
  {
    question: "What is 'Top 20 Product Ideas'?",
    answer:
      "It's a creative ideation tool that generates startup or project ideas using AI based on current trends and your interests. Ideal for indie hackers, student projects, or hackathon prep.",
  },
  {
    question: "What can I do with the Code to Image tool?",
    answer:
      "This feature converts your code snippets into beautifully styled images for social sharing or presentations. Customize themes, fonts, and backgrounds to showcase your code with flair.",
  },
  {
    question: "Is Mockew AI free to use?",
    answer:
      "Mockew AI offers a free plan with access to core tools. We also have premium plans that unlock advanced features like unlimited mock interviews, logo maker, and full code review capabilities.",
  },
  {
    question: "Who is Mockew AI for?",
    answer:
      "Mockew AI is built for developers at all stages — from students and job seekers to experienced engineers and indie makers. Whether you're prepping for an interview or sharing your latest project, Mockew AI is your companion.",
  },
];


    return (
        <>
        <BlurFade inView>
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 mt-10 px-4">
    {/* Badge */}
    <a
      href="https://www.producthunt.com/products/mockew-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-mockew&#0045;ai"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=973254&theme=light&t=1748928223074"
        alt="Mockew AI on Product Hunt"
        style={{ width: 250, height: 54 }}
        width={250}
        height={54}
      />
    </a>
  </div>
            {/* <div onClick={goToDashboard} className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] mt-8">
              

                <span
                    className={cn(
                        "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-br from-pink-400 via-orange-300 to-yellow-200 bg-[length:300%_100%] p-[1px]",
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
                    New: DebugFeed
                </AnimatedGradientText>
                <ChevronRight
                    className="ml-1 size-4 stroke-neutral-500 transition-transform
 duration-300 ease-in-out group-hover:translate-x-0.5"
                />
            </div> */}
            </BlurFade>
            <h1
                className="text-5xl font-extrabold -mb-3 text-center"><AnimatedGradientText
                    speed={2}
                >
                    MOCKEW AI
                </AnimatedGradientText> - INTERVIEW PAIN SIMULATOR</h1>
            <TextAnimate
      variants={{
        hidden: {
          opacity: 0,
          y: 30,
          rotate: 45,
          scale: 0.5,
        },
        show: (i) => ({
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: {
            delay: i * 0.1,
            duration: 0.4,
            y: {
              type: "spring",
              damping: 12,
              stiffness: 200,
              mass: 0.8,
            },
            rotate: {
              type: "spring",
              damping: 8,
              stiffness: 150,
            },
            scale: {
              type: "spring",
              damping: 10,
              stiffness: 300,
            },
          },
        }),
        exit: (i) => ({
          opacity: 0,
          y: 30,
          rotate: 45,
          scale: 0.5,
          transition: {
            delay: i * 0.1,
            duration: 0.4,
          },
        }),
      }}
      by="character"
    >
      Congrats on being smart enough to choose Mockew. now prove it - watch the demo video before clicking random buttons like a maniac.
    </TextAnimate>
            <div className="relative z-0 mb-40 mt-5">
                <div className="absolute inset-0 z-[-1] rounded-2xl p-[2px] bg-[linear-gradient(to_right,_red,_orange,_yellow,_green,_blue,_indigo,_violet)] blur-md" />

                <div className="relative rounded-[35px] bg-white p-1 shadow-lg">
                    <HeroVideoDialog
                        className="block dark:hidden rounded-4xl"
                        animationStyle="top-in-bottom-out"
                        videoSrc="https://www.youtube.com/embed/iAaSwBNMRMk?si=sMZz27ukPsRNFgfE"
                        thumbnailSrc="https://raw.githubusercontent.com/anshxs/mocked/refs/heads/main/thumb.jpg"
                        thumbnailAlt="Demo Video"
                    />
                </div>
            </div>

            <BentoDemo />
            <AnimatedBeamDemo />
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
            <PricingDemoUI/>
        </>
    )
}

export default OnBoardMain
