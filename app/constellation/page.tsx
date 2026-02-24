"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Star, Sparkle, Loader2, Share2, RefreshCw, Heart, Lock, Unlock, ChevronRight, Zap, Wand2 } from "lucide-react"
import Link from "next/link"
import { LoadingAnimation } from "@/components/loading-animation"

// 十二星座数据 - 只保留最基础的信息
const CONSTELLATIONS = [
  { name: "白羊座", symbol: "♈", date: "3.21-4.19" },
  { name: "金牛座", symbol: "♉", date: "4.20-5.20" },
  { name: "双子座", symbol: "♊", date: "5.21-6.21" },
  { name: "巨蟹座", symbol: "♋", date: "6.22-7.22" },
  { name: "狮子座", symbol: "♌", date: "7.23-8.22" },
  { name: "处女座", symbol: "♍", date: "8.23-9.22" },
  { name: "天秤座", symbol: "♎", date: "9.23-10.23" },
  { name: "天蝎座", symbol: "♏", date: "10.24-11.22" },
  { name: "射手座", symbol: "♐", date: "11.23-12.21" },
  { name: "摩羯座", symbol: "♑", date: "12.22-1.19" },
  { name: "水瓶座", symbol: "♒", date: "1.20-2.18" },
  { name: "双鱼座", symbol: "♓", date: "2.19-3.20" },
]

const QUICK_YEARS = [
  { label: "今年", value: new Date().getFullYear() },
  { label: "去年", value: new Date().getFullYear() - 1 },
  { label: "2024", value: 2024 },
  { label: "2000", value: 2000 },
  { label: "1995", value: 1995 },
  { label: "1990", value: 1990 },
  { label: "1985", value: 1985 },
  { label: "1980", value: 1980 },
]

const MORE_YEARS = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - i - 1)

function getConstellation(month: number, day: number): typeof CONSTELLATIONS[0] {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return CONSTELLATIONS[0]
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return CONSTELLATIONS[1]
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return CONSTELLATIONS[2]
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return CONSTELLATIONS[3]
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return CONSTELLATIONS[4]
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return CONSTELLATIONS[5]
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return CONSTELLATIONS[6]
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return CONSTELLATIONS[7]
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return CONSTELLATIONS[8]
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return CONSTELLATIONS[9]
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return CONSTELLATIONS[10]
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return CONSTELLATIONS[11]
  return CONSTELLATIONS[0]
}

// 庆祝动画组件
function CelebrationEffect({ onComplete }: { onComplete?: () => void }) {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, emoji: string}>>([])
  
  useEffect(() => {
    const emojis = ["✨", "⭐", "💫", "🌟", "💖", "🎉", "🔮", "🌙", "🪐", "🌙"]
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }))
    setParticles(newParticles)
    
    const timer = setTimeout(() => {
      onComplete?.()
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-celebrate text-3xl"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}

function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-star-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
          }}
        />
      ))}
    </div>
  )
}

function DatePicker({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  // 直接从字符串解析年月日，不使用时区转换
  const parseDate = (dateStr: string) => {
    const parts = dateStr.split('-')
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10)
    }
  }

  const initial = parseDate(value || "2000-01-01")
  const [year, setYear] = useState(initial.year)
  const [month, setMonth] = useState(initial.month)
  const [day, setDay] = useState(initial.day)
  const [showYearPicker, setShowYearPicker] = useState(false)

  // 当外部value变化时，同步状态
  useEffect(() => {
    const parsed = parseDate(value)
    setYear(parsed.year)
    setMonth(parsed.month)
    setDay(parsed.day)
  }, [value])

  const handleQuickYear = (selectedYear: number) => {
    setYear(selectedYear)
    setShowYearPicker(false)
    // 立即更新父组件
    const maxDay = new Date(selectedYear, month, 0).getDate()
    const validDay = Math.min(day, maxDay)
    onChange(`${selectedYear}-${String(month).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`)
  }

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth)
    // 调整日期到当月最大天数
    const maxDay = new Date(year, newMonth, 0).getDate()
    const validDay = Math.min(day, maxDay)
    setDay(validDay)
    onChange(`${year}-${String(newMonth).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`)
  }

  const handleDayChange = (newDay: number) => {
    setDay(newDay)
    onChange(`${year}-${String(month).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`)
  }

  const maxDay = new Date(year, month, 0).getDate()

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_YEARS.map((q) => (
          <button
            key={q.value}
            type="button"
            onClick={() => handleQuickYear(q.value)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              year === q.value 
                ? "bg-purple-500 text-white" 
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {q.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowYearPicker(!showYearPicker)}
          className="px-3 py-1.5 rounded-full text-sm bg-white/10 text-white/70 hover:bg-white/20"
        >
          更多...
        </button>
      </div>

      {showYearPicker && (
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-5 gap-2">
            {MORE_YEARS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  handleQuickYear(y)
                  setShowYearPicker(false)
                }}
                className={`px-2 py-1 rounded text-sm transition-all ${
                  year === y 
                    ? "bg-purple-500 text-white" 
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-white/60">年份</label>
          <select
            value={year}
            onChange={(e) => handleQuickYear(Number(e.target.value))}
            className="w-full h-12 px-3 rounded-xl bg-white/10 border border-white/20 text-white appearance-none cursor-pointer"
          >
            {MORE_YEARS.map((y) => (
              <option key={y} value={y} className="bg-gray-800">{y}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/60">月份</label>
          <select
            value={month}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="w-full h-12 px-3 rounded-xl bg-white/10 border border-white/20 text-white appearance-none cursor-pointer"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m} className="bg-gray-800">{m}月</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/60">日期</label>
          <select
            value={day}
            onChange={(e) => handleDayChange(Number(e.target.value))}
            className="w-full h-12 px-3 rounded-xl bg-white/10 border border-white/20 text-white appearance-none cursor-pointer"
          >
            {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d} className="bg-gray-800">{d}日</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default function ConstellationPage() {
  const [birthDate, setBirthDate] = useState("2000-01-01")
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [result, setResult] = useState<{
    constellation: typeof CONSTELLATIONS[0]
    birthDate: string
    aiAnalysis: string
  } | null>(null)
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false)
  const [simpleExplanation, setSimpleExplanation] = useState<string>("")
  const [isExplaining, setIsExplaining] = useState(false)

  const handleCalculate = async () => {
    if (!birthDate) return
    
    setIsLoading(true)
    setShowResult(false)
    
    // 正确解析日期字符串，避免时区问题
    const [yearStr, monthStr, dayStr] = birthDate.split('-')
    const month = parseInt(monthStr, 10)
    const day = parseInt(dayStr, 10)
    
    const constellation = getConstellation(month, day)

    setResult({ constellation, birthDate, aiAnalysis: '' })
    setIsAnalyzingAI(true)

    try {
      // 调用AI分析接口
      console.log('发送AI分析请求...', { birthDate, constellation })
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'constellation',
          input: {
            birthDate: birthDate,
            constellation: constellation.name,
          },
          result: {
            name: constellation.name,
            symbol: constellation.symbol,
            date: constellation.date,
            birthDate: birthDate,
          }
        })
      })

      const data = await response.json()
      console.log('AI响应数据:', data)
      
      if (data.error) {
        console.error('AI返回错误:', data.error)
        setResult({ 
          constellation, 
          birthDate,
          aiAnalysis: '此刻星辰沉默，请稍后再试。'
        })
      } else {
        setResult({ 
          constellation, 
          birthDate,
          aiAnalysis: data.analysis || 'AI正在凝望星辰，为你探寻命运...'
        })
      }
    } catch (error) {
      console.error('AI分析错误:', error)
      setResult({ 
        constellation, 
        birthDate,
        aiAnalysis: '此刻星辰沉默，请稍后再试。'
      })
    } finally {
      setIsAnalyzingAI(false)
    }
    
    setIsLoading(false)
    setShowCelebration(true)
    setShowResult(true)
  }

  // 获取通俗解读
  const handleGetSimpleExplanation = async () => {
    if (!result || !result.aiAnalysis) return
    
    setIsExplaining(true)
    setSimpleExplanation("")

    try {
      const prompt = `你是一位通俗易懂的星座大师。刚才你为一个用户进行了深奥的星座分析，现在用户表示看不懂，请你用最简单、直白、接地气的语言，把刚才的星座分析解释给用户听。

刚才的星座分析原文：
${result.aiAnalysis}

要求：
1. 用最通俗的大白话解释，像朋友聊天一样
2. 告诉用户这个星座对他/她的性格特点、感情、工作具体有什么影响
3. 重点说清楚：性格优点、需要注意什么、适合做什么
4. 保持神秘感但要让人听得懂
5. 150-200字左右
6. 格式用【通俗解读】作为标题

请开始解读：`

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'constellation',
          input: { birthDate, constellation: result.constellation.name },
          result: { 
            name: result.constellation.name,
            symbol: result.constellation.symbol,
            date: result.constellation.date,
            birthDate: birthDate,
            prompt: prompt
          }
        })
      })
      const data = await response.json()
      if (data.analysis) {
        setSimpleExplanation(data.analysis)
      }
    } catch (error) {
      console.error('通俗解读错误:', error)
    } finally {
      setIsExplaining(false)
    }
  }

  const handleShare = () => {
    if (navigator.share && result) {
      navigator.share({
        title: `我的星座是${result.constellation.name}`,
        text: `我是${result.constellation.name}，星辰为我揭示了命运的奥秘...`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(`我是${result?.constellation.name}，星辰为我揭示了命运的奥秘...`)
      alert("已复制到剪贴板！")
    }
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-purple-950 to-background" />
      <StarField />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-white">星座解析</h1>
        </div>

        {showCelebration && <CelebrationEffect onComplete={() => setShowCelebration(false)} />}

        {!showResult ? (
          <Card className="max-w-xl mx-auto border-white/10 bg-white/10 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="font-serif text-2xl text-white">探索你的星辰密码</CardTitle>
              <CardDescription className="text-white/70">
                星辰运转之间，命运已悄然改变
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">你的出生日期</label>
                <DatePicker value={birthDate} onChange={setBirthDate} />
              </div>

              <Button 
                onClick={handleCalculate}
                disabled={!birthDate || isLoading}
                className="w-full h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-lg font-semibold rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    星辰正在低语...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    聆听星辰的指引
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-white/50">
                🚀 测试期无限次 · AI智能推演 · 星辰解密
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
            {/* 星座卡片 - 简洁神秘 */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden">
              <div 
                className="h-40 flex items-center justify-center relative"
                style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.2) 0%, transparent 100%)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="relative z-10 text-9xl animate-float">{result?.constellation.symbol}</div>
              </div>
              <CardHeader className="text-center -mt-8 relative z-10">
                <CardTitle className="font-serif text-3xl text-white">{result?.constellation.name}</CardTitle>
                <CardDescription className="text-white/60 text-lg">
                  {result?.constellation.date}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* AI解读 - 神秘深邃 */}
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-blue-900/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  星辰的启示
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalyzingAI ? (
                  <LoadingAnimation message="星辰正在排列..." />
                ) : (
                  <div className="prose prose-invert max-w-none">
                    {result?.aiAnalysis.split('\n').map((line, i) => {
                      if (line.match(/^【.+】$/)) {
                        return <h4 key={i} className="text-purple-300 font-semibold mt-6 mb-3 text-lg">{line}</h4>
                      }
                      if (line.trim()) {
                        return <p key={i} className="text-white/80 leading-8 text-base mb-3">{line}</p>
                      }
                      return null
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 通俗解读按钮 */}
            {!simpleExplanation && !isExplaining && result?.aiAnalysis && (
              <Button
                onClick={handleGetSimpleExplanation}
                className="w-full h-12 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                帮我解读（通俗版）
              </Button>
            )}

            {/* 通俗解读内容 */}
            {(simpleExplanation || isExplaining) && (
              <Card className="border-pink-500/30 bg-gradient-to-br from-pink-900/30 to-rose-900/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    通俗解读
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isExplaining ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-pink-400 animate-spin mx-auto mb-3" />
                        <p className="text-white/60">正在用大白话解释...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      {simpleExplanation.split('\n').map((line, i) => {
                        if (line.match(/^【.+】$/)) {
                          return <h4 key={i} className="text-pink-300 font-semibold mt-4 mb-2 text-base">{line}</h4>
                        }
                        if (line.trim()) {
                          return <p key={i} className="text-white/80 leading-7 text-sm mb-2">{line}</p>
                        }
                        return null
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 神秘分隔语 */}
            <div className="text-center py-4">
              <p className="text-white/30 text-sm italic">
                "星辰不会告诉你全部，但会指引你方向"
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowResult(false)}
                className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                再次探寻
              </Button>
              <Button 
                onClick={handleShare}
                className="flex-1 h-12 bg-gradient-to-r from-pink-500 to-purple-500"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享启示
              </Button>
            </div>

            <Link href="/" className="block">
              <Button variant="ghost" className="w-full text-white/60 hover:text-white">
                返回首页继续探索
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
