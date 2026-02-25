"use client"

import { useState, useRef } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PosterData {
  title: string
  subtitle?: string
  mainContent: string
  extraInfo?: string
  symbol?: string
  theme?: "purple" | "rose" | "amber" | "stone"
}

interface PosterGeneratorProps {
  data: PosterData
  onGenerate?: (dataUrl: string) => void
}

const themeStyles = {
  purple: {
    bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    accent: "#f472b6",
  },
  rose: {
    bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    accent: "#fbbf24",
  },
  amber: {
    bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    accent: "#fef3c7",
  },
  stone: {
    bg: "linear-gradient(135deg, #44403c 0%, #292524 100%)",
    accent: "#fbbf24",
  },
}

export function PosterGenerator({ data, onGenerate }: PosterGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const theme = themeStyles[data.theme || "purple"]

  const generatePoster = async () => {
    setIsGenerating(true)

    try {
      // 创建一个canvas
      const canvas = document.createElement("canvas")
      canvas.width = 400
      canvas.height = 600
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("无法创建canvas")
      }

      // 绘制背景
      const gradient = ctx.createLinearGradient(0, 0, 400, 600)
      gradient.addColorStop(0, theme.bg.split(" ")[1] || "#667eea")
      gradient.addColorStop(1, theme.bg.split(" ")[3] || "#764ba2")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 400, 600)

      // 添加装饰圆
      ctx.fillStyle = "rgba(255,255,255,0.1)"
      ctx.beginPath()
      ctx.arc(50, 50, 100, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(350, 550, 80, 0, Math.PI * 2)
      ctx.fill()

      // 绘制符号
      if (data.symbol) {
        ctx.font = "80px serif"
        ctx.fillStyle = "rgba(255,255,255,0.3)"
        ctx.textAlign = "center"
        ctx.fillText(data.symbol, 200, 150)
      }

      // 绘制标题
      ctx.font = "bold 36px serif"
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.fillText(data.title, 200, 220)

      // 绘制副标题
      if (data.subtitle) {
        ctx.font = "16px sans-serif"
        ctx.fillStyle = "rgba(255,255,255,0.7)"
        ctx.fillText(data.subtitle, 200, 255)
      }

      // 绘制主要内容
      ctx.font = "18px sans-serif"
      ctx.fillStyle = "#ffffff"
      const lines = data.mainContent.split("\n")
      let y = 320
      lines.forEach((line) => {
        ctx.fillText(line, 200, y)
        y += 30
      })

      // 绘制额外信息
      if (data.extraInfo) {
        ctx.font = "14px sans-serif"
        ctx.fillStyle = "rgba(255,255,255,0.6)"
        const extraLines = data.extraInfo.split("\n")
        extraLines.forEach((line) => {
          ctx.fillText(line, 200, y + 20)
          y += 22
        })
      }

      // 绘制底部Logo
      ctx.font = "14px sans-serif"
      ctx.fillStyle = "rgba(255,255,255,0.5)"
      ctx.fillText("知几 · 东西方智慧决策平台", 200, 560)

      // 转换为图片
      const dataUrl = canvas.toDataURL("image/png")

      // 触发下载
      const link = document.createElement("a")
      link.download = `知几-${data.title}.png`
      link.href = dataUrl
      link.click()

      // 回调
      onGenerate?.(dataUrl)
    } catch (error) {
      console.error("生成海报失败:", error)
      alert("生成海报失败，请重试")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generatePoster}
      disabled={isGenerating}
      className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          生成中...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          生成海报
        </>
      )}
    </Button>
  )
}
