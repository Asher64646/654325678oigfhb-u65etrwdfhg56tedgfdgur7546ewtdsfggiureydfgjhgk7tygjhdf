import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { brief } = await req.json();

    if (!brief || !brief.trim()) {
      return NextResponse.json(
        { error: "Brief is required" },
        { status: 400 }
      );
    }

    // TEMP: deterministic output (safe, no OpenAI yet)
    return NextResponse.json({
      title: "Asher AI Generated Site",
      pages: [
        {
          path: "/",
          title: "Home",
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Home</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #0b0616;
      color: #e9d5ff;
      padding: 40px;
    }
    h1 { color: #c084fc; }
  </style>
</head>
<body>
  <h1>Welcome</h1>
  <p>${brief}</p>
</body>
</html>
          `,
        },
      ],
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
