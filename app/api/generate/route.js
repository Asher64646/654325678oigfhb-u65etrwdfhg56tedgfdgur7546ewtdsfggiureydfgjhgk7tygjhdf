import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { brief } = await req.json();

    if (!brief) {
      return NextResponse.json({ error: "Brief required" }, { status: 400 });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert web designer. Generate clean HTML pages.",
          },
          {
            role: "user",
            content: `Create a full homepage HTML for this website:\n${brief}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const html = data.choices?.[0]?.message?.content || "<h1>Error</h1>";

    return NextResponse.json({
      title: "Asher AI Site",
      pages: [
        {
          path: "/",
          title: "Home",
          html,
        },
      ],
    });
  } catch (e) {
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}
