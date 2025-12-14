"use client";

import dynamic from "next/dynamic";

const Builder = dynamic(
  () => import("../ai_website_maker_single_file_react_app.jsx"),
  { ssr: false }
);

export default function Page() {
  return <Builder />;
}
