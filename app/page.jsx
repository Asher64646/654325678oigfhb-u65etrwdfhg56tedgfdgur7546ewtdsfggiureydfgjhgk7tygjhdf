"use client";

import { useState } from "react";

export default function Page() {
  const [text, setText] = useState("");

  return (
    <div className="min-h-screen bg-black text-purple-200 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Asher AI is LIVE 🌌</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Generated: " + text);
        }}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <textarea
          className="p-3 rounded bg-purple-950 border border-purple-700"
          placeholder="Describe your website…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 rounded p-2"
        >
          Generate
        </button>
      </form>
    </div>
  );
}
