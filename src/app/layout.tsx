import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { auth } from "@/auth";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";


export const metadata: Metadata = {


  title: "TMS",
  description: "We're here to Increase your Productivity",
  generator: "next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    {
      name: "Ashutosh Mishra",
      url: "https://github.com/ashutoshmishra",
    }
  ],
  viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/icons-512.png" },
    { rel: "icon", url: "/icons-512.png" },
  ]
 
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Choose weights
  variable: "--font-poppins", // Define a CSS variable
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" className={poppins.variable}>
        <head>
          <meta name="theme-color" content="#ffffff"/>
          <link rel="manifest" href="/manifest.json"/>
          <link rel="icon" href="/icons-512.png" />
          <link rel="apple-touch-icon" href="/icons-512.png" />
        </head>
        <body>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}