"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

// 客户端包装器
export function ThemeToggle() {
  return <ThemeToggleInner />
}

function ThemeToggleInner() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
      aria-label="切换主题"
    >
      <Sun className="w-5 h-5 text-amber-400 dark:block hidden" />
      <Moon className="w-5 h-5 text-purple-400 dark:hidden block" />
    </button>
  )
}
