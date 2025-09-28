import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "AI Recruitment Tool",
  description: "AI Recruitment Tool",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans">
        <div className="gradient-bg min-h-screen">{children}</div>
      </body>
    </html>
  )
}
