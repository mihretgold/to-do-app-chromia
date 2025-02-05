"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "@/components/ContextProvider";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes"; // Add ThemeProvider import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // State to manage theme loading on client-side
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // After the component has mounted on the client
  }, []);

  // Prevent rendering on the server-side to avoid hydration issues
  if (!mounted) {
    return null; // Can also return a loading state here
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <ContextProvider>
            <NavBar />
            {children}
          </ContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
