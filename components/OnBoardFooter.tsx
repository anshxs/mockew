import React from 'react'
import { BoxReveal } from "@/components/magicui/box-reveal";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function OnBoardFooter() {
  return (
    <div className="size-full max-w-lg items-center justify-center overflow-hidden pt-14">
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
  )
}
