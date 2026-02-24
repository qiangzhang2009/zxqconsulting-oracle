import type { Metadata } from "next"
import { Source_Serif_4, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/providers"

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
})

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "命运方舟 | Fortune Insight - AI智能算命",
  description: "结合传统命理学与AI技术，提供八字、星座、周易等多元化的智能算命服务",
  keywords: "算命,八字,星座,周易,塔罗,命理,AI算命",
  authors: [{ name: "Fortune Insight Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        serif.variable,
        sans.variable
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
