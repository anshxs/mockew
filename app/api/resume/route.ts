import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  try {
    const { text: result } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are a senior hiring manager. Please review the following resume and give a complete summary of this developer for other hiring managers to easily understand the user's capablities:\n\n${code}`,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate text with Gemini" },
      { status: 500 }
    );
  }
}