"use client"

import { Sparkles, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface LoadingAnimationProps {
  message?: string
}

export function LoadingAnimation({ message = "命运推演中..." }: LoadingAnimationProps) {
  const [phase, setPhase] = useState(0)
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4)
      setDots((d) => {
        if (d.length >= 3) return ""
        return d + "."
      })
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const phases = [
    "正在解读命理...",
    "星辰正在排列...",
    "天机即将显现...",
    "命运之轮转动中...",
  ]

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* 神秘转盘动画 */}
      <div className="relative w-32 h-32 mb-8">
        {/* 外圈 */}
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full" />
        </div>
        
        {/* 中圈 - 反向旋转 */}
        <div className="absolute inset-2 rounded-full border-2 border-amber-500/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full" />
        </div>
        
        {/* 内圈 */}
        <div className="absolute inset-4 rounded-full border border-pink-500/30 animate-spin" style={{ animationDuration: '4s' }}>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full" />
        </div>
        
        {/* 中心 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* 动态文字 */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-white/90">
          {phases[phase]}
        </h3>
        <p className="text-sm text-white/50">
          这是一场与星辰的对话，请耐心等待...
        </p>
      </div>

      {/* 底部装饰 */}
      <div className="mt-8 flex items-center gap-2 text-white/30">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/30" />
        <span className="text-xs">命运方舟</span>
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/30" />
      </div>
    </div>
  )
}

// 简化版加载动画 - 用于按钮内
export function ButtonLoading() {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>推演中...</span>
    </div>
  )
}
