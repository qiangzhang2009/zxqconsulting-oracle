"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Calendar, Clock, User, Loader2, Share2, RefreshCw, Gem, Crown, Lock, Unlock, ChevronRight, Zap } from "lucide-react"
import Link from "next/link"
import { LoadingAnimation, ButtonLoading } from "@/components/loading-animation"

// 八字计算相关的常量
const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

// 快速选择年份
const QUICK_YEARS = [
  { label: "今年", value: new Date().getFullYear() },
  { label: "去年", value: new Date().getFullYear() - 1 },
  { label: "2024", value: 2024 },
  { label: "2000", value: 2000 },
  { label: "1995", value: 1995 },
  { label: "1990", value: 1990 },
  { label: "1985", value: 1985 },
  { label: "1980", value: 1980 },
  { label: "1975", value: 1975 },
  { label: "1970", value: 1970 },
]

const MORE_YEARS = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i - 1)

const HOUR_OPTIONS = [
  { value: 23, label: "子时", time: "23:00-01:00" },
  { value: 1, label: "丑时", time: "01:00-03:00" },
  { value: 3, label: "寅时", time: "03:00-05:00" },
  { value: 5, label: "卯时", time: "05:00-07:00" },
  { value: 7, label: "辰时", time: "07:00-09:00" },
  { value: 9, label: "巳时", time: "09:00-11:00" },
  { value: 11, label: "午时", time: "11:00-13:00" },
  { value: 13, label: "未时", time: "13:00-15:00" },
  { value: 15, label: "申时", time: "15:00-17:00" },
  { value: 17, label: "酉时", time: "17:00-19:00" },
  { value: 19, label: "戌时", time: "19:00-21:00" },
  { value: 21, label: "亥时", time: "21:00-23:00" },
]

// 日期选择器组件
function DatePicker({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const initialDate = value || "2000-01-01"
  const [year, setYear] = useState(() => new Date(initialDate).getFullYear())
  const [month, setMonth] = useState(() => new Date(initialDate).getMonth() + 1)
  const [day, setDay] = useState(() => new Date(initialDate).getDate())
  const [showYearPicker, setShowYearPicker] = useState(false)

  useEffect(() => {
    if (value) {
      const d = new Date(value)
      setYear(d.getFullYear())
      setMonth(d.getMonth() + 1)
      setDay(d.getDate())
    }
  }, [value])

  const handleQuickYear = (selectedYear: number) => {
    setYear(selectedYear)
    setShowYearPicker(false)
  }

  const handleChange = () => {
    const maxDay = new Date(year, month, 0).getDate()
    const validDay = Math.min(day, maxDay)
    onChange(`${year}-${String(month).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`)
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
                ? "bg-amber-500 text-white" 
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
                    ? "bg-amber-500 text-white" 
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
            onChange={(e) => {
              setYear(Number(e.target.value))
              handleChange()
            }}
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
            onChange={(e) => {
              setMonth(Number(e.target.value))
              handleChange()
            }}
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
            onChange={(e) => {
              setDay(Number(e.target.value))
              handleChange()
            }}
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

// 八字计算函数
function calculateBazi(year: number, month: number, day: number, hour: number) {
  // 简化版八字计算
  const yearGanIndex = (year - 4) % 10
  const yearZhiIndex = (year - 4) % 12
  const monthGanIndex = (month * 2 + year % 10) % 10
  const monthZhiIndex = (month + 2) % 12
  const dayGanIndex = (day + year + month) % 10
  const dayZhiIndex = (day + hour) % 12
  const hourGanIndex = (hour + 2) % 10
  const hourZhiIndex = (hour + 1) % 12

  return {
    yearGan: TIANGAN[yearGanIndex < 0 ? yearGanIndex + 10 : yearGanIndex],
    yearZhi: DIZHI[yearZhiIndex < 0 ? yearZhiIndex + 12 : yearZhiIndex],
    monthGan: TIANGAN[monthGanIndex < 0 ? monthGanIndex + 10 : monthGanIndex],
    monthZhi: DIZHI[monthZhiIndex < 0 ? monthZhiIndex + 12 : monthZhiIndex],
    dayGan: TIANGAN[dayGanIndex < 0 ? dayGanIndex + 10 : dayGanIndex],
    dayZhi: DIZHI[dayZhiIndex < 0 ? dayZhiIndex + 12 : dayZhiIndex],
    hourGan: TIANGAN[hourGanIndex < 0 ? hourGanIndex + 10 : hourGanIndex],
    hourZhi: DIZHI[hourZhiIndex < 0 ? hourZhiIndex + 12 : hourZhiIndex],
    year: year,
    month: month,
    day: day,
    hour: hour,
  }
}

export default function BaziPage() {
  const [birthDate, setBirthDate] = useState("2000-01-01")
  const [birthHour, setBirthHour] = useState(23)
  const [gender, setGender] = useState<"male" | "female">("male")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof calculateBazi> | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string>("")
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false)

  const handleCalculate = async () => {
    if (!birthDate) return
    setIsLoading(true)
    
    const date = new Date(birthDate)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    const bazi = calculateBazi(year, month, day, birthHour)
    setResult(bazi)
    setIsAnalyzingAI(true)

    try {
      // 调用AI分析接口
      console.log('发送AI分析请求...', { birthDate, birthHour, gender, bazi })
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'bazi',
          input: {
            birthDate: birthDate,
            birthTime: `${birthHour}:00`,
            gender: gender,
          },
          result: {
            yearGan: bazi.yearGan,
            yearZhi: bazi.yearZhi,
            monthGan: bazi.monthGan,
            monthZhi: bazi.monthZhi,
            dayGan: bazi.dayGan,
            dayZhi: bazi.dayZhi,
            hourGan: bazi.hourGan,
            hourZhi: bazi.hourZhi,
          }
        })
      })

      const data = await response.json()
      console.log('AI响应数据:', data)
      
      if (data.error) {
        console.error('AI返回错误:', data.error)
        setAiAnalysis('此刻天机不可泄露，请稍后再试。')
      } else {
        setAiAnalysis(data.analysis || '命运之轮正在转动...')
      }
    } catch (error) {
      console.error('AI分析错误:', error)
      setAiAnalysis('此刻天机不可泄露，请稍后再试。')
    } finally {
      setIsAnalyzingAI(false)
      setIsLoading(false)
    }
  }

  const handleShare = () => {
    if (result) {
      const text = `我已窥见天机：${result.yearGan}${result.yearZhi}年·${result.monthGan}${result.monthZhi}月·${result.dayGan}${result.dayZhi}日·${result.hourGan}${result.hourZhi}时。命运方舟，为你揭示人生密码！`
      if (navigator.share) {
        navigator.share({
          title: '我的八字命盘',
          text: text,
          url: window.location.href,
        })
      } else {
        navigator.clipboard.writeText(text)
        alert("已复制到剪贴板！")
      }
    }
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-indigo-950 to-background" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              borderRadius: '50%',
              backgroundColor: 'rgba(147, 51, 234, 0.3)',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-white">八字命理</h1>
        </div>

        {!result ? (
          <Card className="max-w-xl mx-auto border-white/10 bg-white/10 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center mb-4">
                <Gem className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="font-serif text-2xl text-white">探索你的命运密码</CardTitle>
              <CardDescription className="text-white/70">
                阴阳五行之间，命运玄机等你来解
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  出生日期
                </label>
                <DatePicker value={birthDate} onChange={setBirthDate} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  出生时辰
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {HOUR_OPTIONS.map((hour) => (
                    <button
                      key={hour.value}
                      type="button"
                      onClick={() => setBirthHour(hour.value)}
                      className={`p-2 rounded-lg text-xs transition-all ${
                        birthHour === hour.value
                          ? "bg-amber-500 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      <div className="font-medium">{hour.label}</div>
                      <div className="opacity-60">{hour.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  性别
                </label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${gender === "male" ? "bg-purple-500/30 border-purple-500" : "bg-white/10 border-white/20"} border`}>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                      className="hidden"
                    />
                    <span className={gender === "male" ? "text-purple-400" : "text-white/60"}>♂ 男</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${gender === "female" ? "bg-pink-500/30 border-pink-500" : "bg-white/10 border-white/20"} border`}>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                      className="hidden"
                    />
                    <span className={gender === "female" ? "text-pink-400" : "text-white/60"}>♀ 女</span>
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleCalculate}
                disabled={!birthDate || isLoading}
                className="w-full h-14 bg-gradient-to-r from-amber-500 via-purple-500 to-pink-500 hover:from-amber-600 hover:via-purple-600 hover:to-pink-600 text-lg font-semibold rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    命理正在推演中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    窥探天机
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-white/50">
                🚀 测试期无限次 · AI智能推演 · 命理解读
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
            {/* 八字命盘卡片 - 简洁神秘 */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-white">
                  <Crown className="w-6 h-6 text-amber-400" />
                  命运之轮
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {[
                    { label: "年", gan: result.yearGan, zhi: result.yearZhi },
                    { label: "月", gan: result.monthGan, zhi: result.monthZhi },
                    { label: "日", gan: result.dayGan, zhi: result.dayZhi },
                    { label: "时", gan: result.hourGan, zhi: result.hourZhi },
                  ].map((col, i) => (
                    <div key={i} className="space-y-2">
                      <div className="text-xs text-white/50">{col.label}</div>
                      <div className="h-16 flex items-center justify-center bg-white/5 rounded-lg">
                        <span className="text-2xl font-serif text-amber-400">{col.gan}{col.zhi}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center text-white/50 text-sm">
                  {result.year}年 {result.month}月 {result.day}日 · {HOUR_OPTIONS.find(h => h.value === result.hour)?.label || '时辰'}
                </div>
              </CardContent>
            </Card>

            {/* AI命理解读 - 神秘深邃 */}
            <Card className="border-amber-500/30 bg-gradient-to-br from-amber-900/40 via-purple-900/30 to-indigo-900/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  天机解读
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalyzingAI ? (
                  <LoadingAnimation message="命运推演中..." />
                ) : (
                  <div className="prose prose-invert max-w-none">
                    {aiAnalysis.split('\n').map((line, i) => {
                      if (line.match(/^【.+】$/)) {
                        return <h4 key={i} className="text-amber-300 font-semibold mt-6 mb-3 text-lg">{line}</h4>
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

            {/* 神秘分隔语 */}
            <div className="text-center py-4">
              <p className="text-white/30 text-sm italic">
                "命运天注定，但运在人改"
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setResult(null)}
                className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重新推演
              </Button>
              <Button 
                onClick={handleShare}
                className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-purple-500"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享天机
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
