import type { Metadata } from "next"
import { Source_Serif_4, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/providers"
import { ThemeProvider } from "@/components/theme-provider"

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
})

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "知几 | 东西方智慧决策平台",
  description: "用智慧指引人生每一步 - 结合千年传统东方智慧与现代西方心理学，打造东西方智慧决策平台",
  keywords: "算命,八字,星座,周易,塔罗,命理,AI算命,知几",
  authors: [{ name: "知几团队" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        serif.variable,
        sans.variable
      )}>
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
