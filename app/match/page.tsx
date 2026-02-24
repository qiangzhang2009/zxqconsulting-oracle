"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Sparkles, RefreshCw, Share2, Copy, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// 星座数据
const constellations = [
  { name: "白羊座", symbol: "♈", emoji: "🐏", date: "3.21-4.19", element: "火", mode: "开创" },
  { name: "金牛座", symbol: "♉", emoji: "🐂", date: "4.20-5.20", element: "土", mode: "固定" },
  { name: "双子座", symbol: "♊", emoji: "👯", date: "5.21-6.21", element: "风", mode: "变动" },
  { name: "巨蟹座", symbol: "♋", emoji: "🦀", date: "6.22-7.22", element: "水", mode: "开创" },
  { name: "狮子座", symbol: "♌", emoji: "🦁", date: "7.23-8.22", element: "火", mode: "固定" },
  { name: "处女座", symbol: "♍", emoji: "👸", date: "8.23-9.22", element: "土", mode: "变动" },
  { name: "天秤座", symbol: "♎", emoji: "⚖️", date: "9.23-10.23", element: "风", mode: "开创" },
  { name: "天蝎座", symbol: "♏", emoji: "🦂", date: "10.24-11.22", element: "水", mode: "固定" },
  { name: "射手座", symbol: "♐", emoji: "🏹", date: "11.23-12.21", element: "火", mode: "变动" },
  { name: "摩羯座", symbol: "♑", emoji: "🐐", date: "12.22-1.19", element: "土", mode: "开创" },
  { name: "水瓶座", symbol: "♒", emoji: "🏺", date: "1.20-2.18", element: "风", mode: "固定" },
  { name: "双鱼座", symbol: "♓", emoji: "🐟", date: "2.19-3.20", element: "水", mode: "变动" },
]

// 匹配度计算（基于星座属性）
function calculateMatch(myConstellation: string, theirConstellation: string) {
  const my = constellations.find(c => c.name === myConstellation)
  const their = constellations.find(c => c.name === theirConstellation)
  
  if (!my || !their) return null
  
  // 基于星座元素的兼容性
  const elementCompatibility: Record<string, Record<string, number>> = {
    "火": { "火": 70, "土": 50, "风": 90, "水": 60 },
    "土": { "火": 50, "土": 80, "风": 60, "水": 85 },
    "风": { "火": 90, "土": 60, "风": 75, "水": 55 },
    "水": { "火": 60, "土": 85, "风": 55, "水": 80 },
  }
  
  // 基于星座模式的兼容性
  const modeCompatibility: Record<string, Record<string, number>> = {
    "开创": { "开创": 75, "固定": 70, "变动": 85 },
    "固定": { "开创": 70, "固定": 90, "变动": 65 },
    "变动": { "开创": 85, "固定": 65, "变动": 80 },
  }
  
  const elementScore = elementCompatibility[my.element]?.[their.element] || 70
  const modeScore = modeCompatibility[my.mode]?.[their.mode] || 70
  
  // 太阳与上升星座的天然吸引力
  const specialPairs: Record<string, string[]> = {
    "白羊座": ["狮子座", "射手座", "双子座", "天秤座"],
    "金牛座": ["处女座", "摩羯座", "巨蟹座", "天蝎座"],
    "双子座": ["天秤座", "水瓶座", "白羊座", "狮子座"],
    "巨蟹座": ["天蝎座", "双鱼座", "金牛座", "处女座"],
    "狮子座": ["射手座", "白羊座", "双子座", "天秤座"],
    "处女座": ["摩羯座", "金牛座", "巨蟹座", "天蝎座"],
    "天秤座": ["双子座", "水瓶座", "狮子座", "白羊座"],
    "天蝎座": ["双鱼座", "巨蟹座", "处女座", "金牛座"],
    "射手座": ["白羊座", "狮子座", "水瓶座", "双子座"],
    "摩羯座": ["金牛座", "处女座", "天蝎座", "双鱼座"],
    "水瓶座": ["天秤座", "双子座", "射手座", "白羊座"],
    "双鱼座": ["天蝎座", "巨蟹座", "摩羯座", "金牛座"],
  }
  
  let bonus = 0
  if (specialPairs[my.name]?.includes(their.name)) {
    bonus = 15
  }
  
  const totalScore = Math.min(98, Math.round((elementScore + modeScore) / 2 + bonus))
  
  return {
    score: totalScore,
    element: my.element,
    theirElement: their.element,
    mode: my.mode,
    theirMode: their.mode,
  }
}

// 生成配对分析
function generateMatchAnalysis(myConstellation: string, theirConstellation: string, match: NonNullable<ReturnType<typeof calculateMatch>>) {
  const elements = {
    "火": "热情活力",
    "土": "稳定务实",
    "风": "理性沟通",
    "水": "情感直觉",
  }
  
  const modes = {
    "开创": "领导型",
    "固定": "坚持型",
    "变动": "适应型",
  }
  
  const advantages = [
    `你们的${elements[match.element as keyof typeof elements]}特质与${elements[match.theirElement as keyof typeof elements]}特质相互吸引，${match.element === match.theirElement ? "相似的能量让你们很容易理解彼此" : "不同的能量让彼此互补"}`,
    `在${modes[match.mode as keyof typeof modes]}与${modes[match.theirMode as keyof typeof modes]}的互动中，${match.mode === match.theirMode ? "你们有着相似的生活节奏" : "你们能带来互补的视角"}`,
    `${myConstellation}的你容易被${theirConstellation}的特质所吸引，${match.score > 80 ? "这是一个天然的吸引力组合" : "需要双方更多理解与磨合"}`,
  ]
  
  const suggestions = [
    match.score > 80 
      ? "你们的天然契合度很高信任与理解会让关系更加稳定"
      : "差异带来互补的可能，但也需要双方更多包容与沟通",
    match.element === match.theirElement
      ? "相似的你们在沟通上会很顺畅，但也需要注意保持独立空间"
      : "不同的你们可以学习彼此的优势，但要尊重对方的思维方式",
    match.mode === match.theirMode
      ? "生活节奏相似让你们的日常相处更加和谐"
      : "一方适应一方引导的互动模式能让关系更加丰富",
  ]
  
  const precautions = [
    match.score < 70 ? "需要时间慢慢了解彼此，不要急于下结论" : "珍惜这份缘分，用心经营",
    match.element === "火" || match.element === "水" ? "注意情绪表达的方式，避免极端反应" : "保持开放的沟通心态",
    "尊重彼此的私人空间，建立健康的相处模式",
  ]
  
  return { advantages, suggestions, precautions }
}

export default function MatchPage() {
  const [myConstellation, setMyConstellation] = useState<string | null>(null)
  const [theirConstellation, setTheirConstellation] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isMatching, setIsMatching] = useState(false)
  const [matchResult, setMatchResult] = useState<ReturnType<typeof calculateMatch> | null>(null)
  const [analysis, setAnalysis] = useState<ReturnType<typeof generateMatchAnalysis> | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleMatch = () => {
    if (!myConstellation || !theirConstellation) return
    
    setIsMatching(true)
    setShowResult(false)
    
    // 模拟分析过程
    setTimeout(() => {
      const result = calculateMatch(myConstellation, theirConstellation)
      const analysisResult = generateMatchAnalysis(myConstellation, theirConstellation, result!)
      
      setMatchResult(result)
      setAnalysis(analysisResult)
      setIsMatching(false)
      setShowResult(true)
    }, 1500)
  }

  const handleReset = () => {
    setMyConstellation(null)
    setTheirConstellation(null)
    setShowResult(false)
    setMatchResult(null)
    setAnalysis(null)
    setIsSaved(false)
  }

  // 保存配对记录到数据库
  const handleSave = async () => {
    if (!matchResult || !myConstellation || !theirConstellation || isSaved) return
    
    setIsSaving(true)
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          myConstellation,
          theirConstellation,
          matchScore: matchResult.score,
          elementCompat: { my: matchResult.element, their: matchResult.theirElement },
          modeCompat: { my: matchResult.mode, their: matchResult.theirMode },
          advantages: analysis?.advantages,
          suggestions: analysis?.suggestions,
          precautions: analysis?.precautions
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setIsSaved(true)
        alert('已保存到你的配对记录中！')
      }
    } catch (error) {
      console.error('保存错误:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = async () => {
    if (!matchResult || !myConstellation || !theirConstellation) return
    
    const text = `我和${theirConstellation}的星座配对指数是${matchResult.score}%！知几星座配对`
    
    if (navigator.share) {
      await navigator.share({
        title: "星座配对",
        text: text,
      })
    } else {
      await navigator.clipboard.writeText(text)
      alert("已复制到剪贴板")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-pink-50 to-violet-50" />
      
      {/* 浮动装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`heart-${i}`}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 3}s`,
            }}
          >
            <Heart 
              className="w-4 h-4 text-pink-400/30" 
              style={{ opacity: Math.random() * 0.5 + 0.2 }}
            />
          </div>
        ))}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[100px]" />
      </div>

      {/* 导航 */}
      <nav className="relative z-20 container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>返回首页</span>
        </Link>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 标题 */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                星座配对
              </span>
            </h1>
            <p className="text-stone-500 text-lg">
              探索你们之间的天然契合度
            </p>
          </div>

          {!showResult ? (
            <>
              {/* 选择我的星座 */}
              <Card className="mb-8 bg-white border-stone-200 shadow-xl shadow-stone-200/50">
                <CardHeader>
                  <CardTitle className="text-stone-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-sm text-white">1</span>
                    你的星座
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {constellations.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setMyConstellation(c.name)}
                        className={cn(
                          "p-3 rounded-xl border transition-all duration-300 text-center",
                          myConstellation === c.name
                            ? "bg-gradient-to-br from-rose-400 to-pink-400 border-pink-300 text-white scale-105 shadow-lg shadow-rose-200"
                            : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:border-stone-300"
                        )}
                      >
                        <div className="text-2xl mb-1">{c.emoji}</div>
                        <div className="text-xs">{c.name}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 选择TA的星座 */}
              <Card className="mb-8 bg-white border-stone-200 shadow-xl shadow-stone-200/50">
                <CardHeader>
                  <CardTitle className="text-stone-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-violet-400 flex items-center justify-center text-sm text-white">2</span>
                    TA的星座
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {constellations.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setTheirConstellation(c.name)}
                        className={cn(
                          "p-3 rounded-xl border transition-all duration-300 text-center",
                          theirConstellation === c.name
                            ? "bg-gradient-to-br from-purple-400 to-violet-400 border-violet-300 text-white scale-105 shadow-lg shadow-violet-200"
                            : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:border-stone-300"
                        )}
                      >
                        <div className="text-2xl mb-1">{c.emoji}</div>
                        <div className="text-xs">{c.name}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 开始配对按钮 */}
              <div className="text-center">
                <Button
                  onClick={handleMatch}
                  disabled={!myConstellation || !theirConstellation || isMatching}
                  size="lg"
                  className={cn(
                    "h-14 px-12 text-lg rounded-full transition-all duration-300",
                    myConstellation && theirConstellation
                      ? "bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-200"
                      : "bg-stone-100 text-stone-300 cursor-not-allowed"
                  )}
                >
                  {isMatching ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      开始配对
                    </>
                  )}
                </Button>
                <p className="text-stone-400 text-sm mt-4">
                  {isMatching ? "星辰正在解读你们的缘分..." : "选择两个星座，了解你们的契合度"}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* 配对结果 */}
              <div className="text-center mb-8">
                {/* 配对指数 */}
                <div className="relative inline-block mb-8">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 flex items-center justify-center shadow-2xl shadow-rose-200 animate-pulse-scale">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-white">{matchResult?.score}</div>
                      <div className="text-white/80 text-sm">匹配指数</div>
                    </div>
                  </div>
                </div>

                {/* 匹配星座显示 */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{constellations.find(c => c.name === myConstellation)?.emoji}</div>
                    <div className="text-stone-700 font-medium">{myConstellation}</div>
                  </div>
                  <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
                  <div className="text-center">
                    <div className="text-4xl mb-2">{constellations.find(c => c.name === theirConstellation)?.emoji}</div>
                    <div className="text-stone-700 font-medium">{theirConstellation}</div>
                  </div>
                </div>

                {/* 匹配度描述 */}
                <p className="text-stone-600 text-lg mb-8">
                  {matchResult && matchResult.score >= 80 && "天然契合，灵魂共鸣"}
                  {matchResult && matchResult.score >= 60 && matchResult.score < 80 && "互补互助，潜力无限"}
                  {matchResult && matchResult.score < 60 && "差异明显，需要更多理解"}
                </p>

                {/* 操作按钮 */}
                <div className="flex items-center justify-center gap-4 mb-12">
                  <Button
                    onClick={handleMatch}
                    variant="outline"
                    className="border-stone-300 text-stone-600 hover:bg-stone-100 rounded-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    重新分析
                  </Button>
                  
                  {/* 保存按钮 */}
                  <Button
                    onClick={handleSave}
                    disabled={isSaved || isSaving}
                    className={`rounded-full ${
                      isSaved 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'border-stone-300 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : isSaved ? (
                      <Sparkles className="w-4 h-4 mr-2" />
                    ) : (
                      <Heart className="w-4 h-4 mr-2" />
                    )}
                    {isSaved ? '已保存' : '保存记录'}
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="border-stone-300 text-stone-600 hover:bg-stone-100 rounded-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    分享结果
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-stone-300 text-stone-600 hover:bg-stone-100 rounded-full"
                  >
                    重新选择
                  </Button>
                </div>
              </div>

              {/* 详细分析 */}
              {analysis && (
                <div className="space-y-6">
                  {/* 契合优势 */}
                  <Card className="bg-white border-stone-200 shadow-lg shadow-stone-100/50">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        契合优势
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.advantages.map((adv, i) => (
                        <p key={i} className="text-stone-600 leading-relaxed">
                          {adv}
                        </p>
                      ))}
                    </CardContent>
                  </Card>

                  {/* 相处建议 */}
                  <Card className="bg-white border-stone-200 shadow-lg shadow-stone-100/50">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-400" />
                        相处建议
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.suggestions.map((sug, i) => (
                        <p key={i} className="text-stone-600 leading-relaxed">
                          {sug}
                        </p>
                      ))}
                    </CardContent>
                  </Card>

                  {/* 注意事项 */}
                  <Card className="bg-white border-stone-200 shadow-lg shadow-stone-100/50">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        <span className="text-amber-500">!</span>
                        注意事项
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {analysis.precautions.map((pre, i) => (
                        <p key={i} className="text-stone-600 leading-relaxed">
                          {pre}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 底部提示 */}
              <p className="text-center text-stone-300 text-sm mt-12">
                本结果仅供参考，星座配对只是了解彼此的一种方式<br/>
                真正的关系需要双方用心经营
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
