import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STPay Frontend",
  description: "Frontend console for the STPay fintech backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
