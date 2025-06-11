import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "ChatterBot",
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: body.messages,
    });

    const response = completion.choices[0].message;

    return NextResponse.json({ output: response }, { status: 200 });
  } catch (err: any) {
    console.error("OpenRouter API Error:", err);

    return NextResponse.json(
      {
        error: "API call failed",
        details: err?.message || err,
      },
      { status: 500 }
    );
  }
}
