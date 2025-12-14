import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function safe(text) {
  return String(text || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function wrapPage({ title, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${safe(title)}</title>
<style>
  body {
    margin:0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    background:
      radial-gradient(circle at 20% 20%, rgba(168,85,247,.28), transparent 40%),
      radial-gradient(circle at 80% 30%, rgba(192,132,252,.22), transparent 45%),
      radial-gradient(circle at 50% 80%, rgba(139,92,246,.26), transparent 50%),
      #050008;
    color:#f5f3ff;
  }
  .wrap{max-width:960px;margin:0 auto;padding:28px}
  .card{
    background:rgba(0,0,0,.55);
    border:1px solid rgba(168,85,247,.35);
    border-radius:16px;
    padding:20px;
    margin-bottom:20px;
  }
  h1,h2{margin-top:0}
  p{line-height:1.6;opacity:.9}
  .btn{
    display:inline-block;
    margin-top:10px;
    padding:10px 14px;
    border-radius:12px;
    background:#a855f7;
    color:white;
    text-decoration:none;
    font-weight:700;
  }
</style>
</head>
<body>
  <div class="wrap">
    ${body}
    <div style="opacity:.6;font-size:12px;margin-top:20px">
      Built by Asher AI
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req) {
  try {
    const { brief, templateId } = await req.json();

    const systemPrompt = `
You are Asher, a professional AI website builder.
You generate clean, modern, professional website content.
Return JSON only.
`;

    const userPrompt = `
Create a professional multi-page website.

TEMPLATE TYPE: ${templateId}
USER BRIEF:
${brief}

Return JSON in this exact shape:

{
  "title": "Site title",
  "pages": [
    { "path": "/", "title": "Home", "content": "<h1>...</h1>" },
    { "path": "/about", "title": "About", "content": "<h1>...</h1>" },
    { "path": "/services", "title": "Services", "content": "<h1>...</h1>" },
    { "path": "/contact", "title": "Contact", "content": "<h1>...</h1>" }
  ]
}

Rules:
- Use real marketing copy
- Be concise but premium
- Do NOT include scripts
- HTML only inside "content"
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    const parsed = JSON.parse(raw);

    const pages = parsed.pages.map((p) => ({
      path: p.path,
      title: p.title,
      html: wrapPage({
        title: p.title,
        body: `<div class="card">${p.content}</div>`,
      }),
    }));

    return NextResponse.json({
      title: parsed.title,
      pages,
    });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
