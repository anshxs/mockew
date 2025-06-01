"use client";
import React, { useEffect, useRef, useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import { backgrounds, languages, themes } from "@/utils/utilities";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeSelector from "@/components/ThemeSelector";
import BackgroundSelector from "@/components/BackgroundSelector";
import PaddingSelector from "@/components/PaddingSelector";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";
import supabase from "@/lib/supabase";

export default function Home() {
  const editorRef = useRef(null);
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string | null>(null);

  const [language, setLanguage] = useState(languages[0].name);
  const [theme, setTheme] = useState(themes[0]);
  const [background, setBackground] = useState(backgrounds[0]);
  const [activeIcon, setActiveIcon] = useState(languages[0].icon);
  const [paddings] = useState(["1rem", "2rem", "3rem", "4rem"]);
  const [currentPadding, setCurrentPadding] = useState(paddings[2]);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching plan:", error.message);
      } else {
        setPlan(data?.plan ?? "Free");
      }

      setLoading(false);
    };

    fetchPlan();
  }, [user]);

  const exportPng = async () => {
    const editorElem = editorRef.current;

    if (editorElem) {
      const handleElems = document.querySelectorAll(".handle") as any;
      const cursorElem = document.querySelector(".ace_cursor") as any;
      const codetitle = document.querySelector(".code-title") as any;
      const codeEditor = document.querySelector(".ace_editor") as any;

      handleElems.forEach((elem: any) => (elem.style.display = "none"));
      if (cursorElem) cursorElem.style.display = "none";
      if (codetitle) codetitle.style.boxShadow = "none";
      if (codeEditor) codeEditor.style.boxShadow = "none";

      const canvas = await html2canvas(editorElem as HTMLElement);
      const image = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const link = document.createElement("a");
      link.download = "code.png";
      link.href = image;
      link.click();

      handleElems.forEach((elem: any) => (elem.style.display = "block"));
      if (cursorElem) cursorElem.style.display = "block";
      if (codetitle) codetitle.style.boxShadow = "0 3px 10px rgba(0, 0, 0, 0.2)";
      if (codeEditor) codeEditor.style.boxShadow = "2px 3px 10px rgba(0, 0, 0, 0.2)";
    }
  };

  if (loading) {
    return (
      <main className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </main>
    );
  }

  if (plan === "Free") {
    return (
      <main className="h-screen w-full flex items-center justify-center text-center px-4">
        <div className="p-8 rounded-xl max-w-md">
          <Button className=" mb-4" variant="default" onClick={() => window.location.href = "/pricing"}>
            Upgrade Now
          </Button>
          <h1 className="text-2xl font-semibold">You're on Free Plan</h1>
          <p className="text-gray-600 mb-6">
            Upgrade to a paid plan to use the code-to-image export feature.
          </p>
          
        </div>
      </main>
    );
  }

  return (
    <main className="h-[100vh] flex flex-col items-center justify-between">
      <header
        className="mt-16 flex gap-6 w-[940px] p-5 fixed top-0 left-1/2 translate-x-[-50%]
         z-10 bg-secondary rounded-xl border-2"
      >
        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
          seActiveIcon={setActiveIcon}
        />
        <ThemeSelector theme={theme} setTheme={setTheme} />
        <BackgroundSelector background={background} setBackground={setBackground} />
        <PaddingSelector
          paddings={paddings}
          currentPadding={currentPadding}
          setCurrentPadding={setCurrentPadding}
        />
        <div className="self-center ml-auto">
          <Button onClick={exportPng}>
            <Download />
            Export PNG
          </Button>
        </div>
      </header>

      <div className="code-editor-ref mt-45" ref={editorRef}>
        <CodeEditor
          language={language}
          theme={theme}
          background={background}
          icon={activeIcon}
          currentPadding={currentPadding}
        />
      </div>
    </main>
  );
}
