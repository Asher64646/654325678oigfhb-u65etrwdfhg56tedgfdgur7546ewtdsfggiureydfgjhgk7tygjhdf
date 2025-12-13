import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Asher AI",
  description: "AI Website Builder powered by Asher",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "radial-gradient(circle at top, #2a003d, #000)",
          color: "#fff",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
