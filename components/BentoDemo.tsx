import {
    BellIcon,
    CalendarIcon,
    FileTextIcon,
    GlobeIcon,
    InputIcon,
  } from "@radix-ui/react-icons";
  import { BlurFade } from "@/components/magicui/blur-fade";
  import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Bot, CheckCheckIcon, File, FileText, Lightbulb, MessageCircle } from "lucide-react";
  
  const features = [
    {
      Icon: MessageCircle,
      name: "Debug Feed",
      description: "A social media only curated for developers",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute opacity-90 object-cover w-full h-full overflow-hidden" src="debugfeed.png" />,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: Bot,
      name: "Realistic Mock Interviews",
      description: "AI that mocks you better than your last interviewer.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute opacity-90 object-cover w-full h-full overflow-hidden" src="01.png" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: FileText,
      name: "Resume Builder",
      description: "Still unemployed? Might be the resume, bro.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute opacity-90 object-cover w-full h-full overflow-hidden" src="resume-builder.png" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: Lightbulb,
      name: "Top 20 Ideas",
      description: "Steal dev ideas better than your own.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute opacity-90 object-cover w-full h-full overflow-hidden" src="top20.png" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: CheckCheckIcon,
      name: "Code Reviewer",
      description:
        "Your code works, but it's still trashy.",
      href: "/",
      cta: "Learn more",
      background: <img className="absolute opacity-90 object-cover w-full h-full overflow-hidden" src="code review.png" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];
  
  export function BentoDemo() {
    return (
        <BlurFade>
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
      </BlurFade>
    );
  }
  