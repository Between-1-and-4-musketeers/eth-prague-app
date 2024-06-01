import "../sushi-ui/index.css"
import "@rainbow-me/rainbowkit/styles.css"

import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import React from "react"
import { Header } from "./components/Header"
import { Providers } from "./components/Providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
})

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono"
})

export const metadata: Metadata = {
  title: "DecGov"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    // <html lang="en" className="[color-scheme:dark]">
    <html
      lang="en"
      className={`${inter.variable} ${roboto_mono.variable} dark`}
      suppressHydrationWarning={true}
    >
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png?v=1"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png?v=1"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png?v=1"
      />
      <link rel="manifest" href="/site.webmanifest?v=1" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#fa52a0" />
      <link rel="shortcut icon" href="/favicon.ico?v=1" />
      <body className="h-screen" suppressHydrationWarning={true}>
        <div className="bg-white/[0.02] min-h-screen">
          <div className="absolute w-full">
            <Header />
          </div>
          <div className="flex justify-center pt-20">
            <div className="flex flex-col px-4 max-w-6xl mb-20 w-full">
              <Providers>{children}</Providers>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
