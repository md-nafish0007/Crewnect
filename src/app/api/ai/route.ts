import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize cautiously. If the key is missing at build time, it won't crash until invoked.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "missing" });

const SYSTEM_INSTRUCTION = `You are the Crewnect AI Assistant, an expert team-building and networking advisor for university students. 
Your goal is to help students form perfect tech crews. 
When a student tells you what skills or tech stack they already have, you must intelligently analyze what critical roles or technologies are missing to form a complete, well-rounded project team or startup crew. 
For example, if they know Frontend and Backend, suggest they look for a UI/UX Designer (Figma), a DevOps Engineer (Docker/AWS), or a Data Architect in the Crewnect Directory. 
Always recommend EXACT 'tech stacks' they should search for to fill those gaps. 
Be highly encouraging, extremely concise, and format your advice securely using clean markdown bullet points. Do not ramble.`;

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "missing") {
      return NextResponse.json(
        { error: "AI Assistant is currently offline. Administrator must provide a GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
        }
    });

    return NextResponse.json({ text: response.text }, { status: 200 });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "Failed to process AI response." },
      { status: 500 }
    );
  }
}
