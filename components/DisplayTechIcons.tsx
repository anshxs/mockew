"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { mappings } from "@/constants";

interface TechIconProps {
  techStack: string[];
}

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<
    { tech: string; url: string }[]
  >([]);

  const techIconBaseURL =
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

  const normalizeTechName = (tech: string) => {
    const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
    return mappings[key as keyof typeof mappings];
  };

  const checkIconExists = (url: string) => {
    return fetch(url, { method: "HEAD" })
      .then((res) => res.ok)
      .catch(() => false);
  };

  useEffect(() => {
    const getTechLogos = () => {
      const logoURLs = techStack.map((tech) => {
        const normalized = normalizeTechName(tech);
        return {
          tech,
          url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
        };
      });

      Promise.all(
        logoURLs.map(({ tech, url }) =>
          checkIconExists(url).then((exists) => ({
            tech,
            url: exists ? url : "/tech.svg",
          }))
        )
      ).then((results) => setTechIcons(results));
    };

    getTechLogos();
  }, [techStack]);

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-gray-200 rounded-full p-2 flex flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="absolute bottom-full mb-1 hidden group-hover:flex px-2 py-1 text-xs text-white bg-black rounded-md shadow-md">{tech}</span>

          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
