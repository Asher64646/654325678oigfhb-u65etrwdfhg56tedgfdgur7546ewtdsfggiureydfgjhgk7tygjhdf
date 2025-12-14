import { NextResponse } from "next/server";

export async function POST(req) {
  const { brief } = await req.json();

  return NextResponse.json({
    title: "Asher AI Generated Site",
    pages: [
      {
        path: "/",
        title: "Home",
        html: `<h2>Your Website</h2><p>${brief}</p>`,
      },
    ],
  });
}
