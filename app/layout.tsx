import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "FutureNote - Lock In Your 2026 Goal",
  description: "Set it once. Lock it in. Write your goal for 2026 and get reminded on Dec 31st.",
};

import MeshGradient from "@/components/MeshGradient";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <CustomCursor />
        <MeshGradient />
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
