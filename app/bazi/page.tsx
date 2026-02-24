"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Calendar, Clock, User, Loader2, Share2, RefreshCw, Gem, Crown, Lock, Unlock, ChevronRight, Zap } from "lucide-react"
import Link from "next/link"

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

  // 当外部value变化时更新内部状态
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
  const yearGanIndex = (year - 4) % 10
  const yearZhiIndex = (year - 4) % 12
  const monthGanIndex = ((year - 1) * 5 + month) % 10
  const monthZhiIndex = (month + 2) % 12
  const dayGanIndex = (day * 2 + 5) % 10
  const dayZhiIndex = (day + 2) % 12
  const hourZhiIndex = hour % 12
  const hourGanIndex = (dayGanIndex * 2 + hourZhiIndex) % 10

  return {
    yearGan: TIANGAN[yearGanIndex],
    yearZhi: DIZHI[yearZhiIndex],
    monthGan: TIANGAN[monthGanIndex],
    monthZhi: DIZHI[monthZhiIndex],
    dayGan: TIANGAN[dayGanIndex],
    dayZhi: DIZHI[dayZhiIndex],
    hourGan: TIANGAN[hourGanIndex],
    hourZhi: DIZHI[hourZhiIndex],
  }
}

// 获取五行
function getWuxing(ganZhi: string): string {
  const wuxingMap: Record<string, string> = {
    "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土", "己": "土",
    "庚": "金", "辛": "金", "壬": "水", "癸": "水",
    "子": "水", "丑": "土", "寅": "木", "卯": "木", "辰": "土", "巳": "火",
    "午": "火", "未": "土", "申": "金", "酉": "金", "戌": "土", "亥": "水"
  }
  return wuxingMap[ganZhi] || ""
}

// 获取五行颜色
function getWuxingColor(wuxing: string): string {
  const colors: Record<string, string> = {
    "木": "#4CAF50",
    "火": "#F44336",
    "土": "#8B4513",
    "金": "#FFD700",
    "水": "#2196F3"
  }
  return colors[wuxing] || "#9E9E9E"
}

// 命主分析 - 更详细
function analyzeDestiny(bazi: ReturnType<typeof calculateBazi>) {
  const dayGan = bazi.dayGan
  const dayZhi = bazi.dayZhi

  const destines: Record<string, any> = {
    "甲": { 
      title: "甲木命 - 参天大树", 
      description: "您是甲木命，如同参天大树，正直向上，有领导才能。性格仁厚，但有时过于固执。", 
      career: "您天生具有领导才能，适合从事管理、决策类工作。事业发展宜向东方或北方。",
      wealth: "财运营运势良好，正财稳定，偏财可关注木相关行业。",
      love: "感情方面需要主动表达，合适的人可能是年长或年轻几岁的异性。",
      health: "注意肝胆方面的健康，保持规律作息。",
      strength: 85, weak: "过于刚直" 
    },
    "乙": { 
      title: "乙木命 - 藤蔓花草", 
      description: "您是乙木命，如同藤蔓花草，柔韧灵活。性格温和，善于变通，但有时缺乏主见。", 
      career: "适合创意、艺术、教育类工作。善于发现机会但需增强执行力。",
      wealth: "财运平稳，适合稳定的理财方式。",
      love: "感情丰富，异性缘佳，但需注意选择。",
      health: "注意神经系统，适当放松。",
      strength: 78, weak: "缺乏决断" 
    },
    "丙": { 
      title: "丙火命 - 太阳之光", 
      description: "您是丙火命，如同太阳之光，热情开朗。富有正义感，但有时过于冲动。", 
      career: "适合需要抛头露面的工作，如销售、公关、演艺。",
      wealth: "财运旺盛但波动较大，建议稳健理财。",
      love: "热情主动，但需注意方式方法。",
      health: "注意心脏和眼睛健康。",
      strength: 92, weak: "易冲动" 
    },
    "丁": { 
      title: "丁火命 - 灯烛之火", 
      description: "您是丁火命，如同灯烛之火，细腻温柔。思想敏锐，但有时多愁善感。", 
      career: "适合细腻、技术类工作，如研究、策划、艺术创作。",
      wealth: "财运平稳，适合技术类投资。",
      love: "感情细腻，容易遇到理解你的人。",
      health: "注意心脏健康，保持心情愉悦。",
      strength: 75, weak: "敏感细腻" 
    },
    "戊": { 
      title: "戊土命 - 高山厚土", 
      description: "您是戊土命，如同高山厚土稳重可靠。性格踏实，但有时过于保守。", 
      career: "适合稳定型工作，如金融、建筑、农业。",
      wealth: "财运稳定，适合房产、土地类投资。",
      love: "专一稳定，但需要主动追求。",
      health: "注意肠胃健康。",
      strength: 88, weak: "过于保守" 
    },
    "己": { 
      title: "己土命 - 田园之土", 
      description: "您是己土命，如同田园之土，宽厚包容。性格稳重，但有时缺乏活力。", 
      career: "适合后勤、服务、教育类工作。",
      wealth: "财运平稳，适宜储蓄理财。",
      love: "温柔贤惠，容易遇到合适的人。",
      health: "注意消化系统。",
      strength: 72, weak: "缺乏活力" 
    },
    "庚": { 
      title: "庚金命 - 金铁之刚", 
      description: "您是庚金命，如同金铁之刚果断坚毅。性格刚强，但有时过于严厉。", 
      career: "适合金融、法律、公安等刚性工作。",
      wealth: "财运旺盛，适合金属、金融类投资。",
      love: "需要找到欣赏你坚韧一面的伴侣。",
      health: "注意呼吸系统。",
      strength: 95, weak: "过于严厉" 
    },
    "辛": { 
      title: "辛金命 - 珠玉之美", 
      description: "您是辛金命，如同珠玉之美精致细腻。性格敏锐，但有时过于敏感。", 
      career: "适合精致、艺术、时尚类工作。",
      wealth: "财运不错，适合艺术品投资。",
      love: "追求完美，需找到心灵相通的人。",
      health: "注意肺部健康。",
      strength: 80, weak: "过于敏感" 
    },
    "壬": { 
      title: "壬水命 - 江河之水", 
      description: "您是壬水命，如同江河之水奔放自由。性格豁达，但有时缺乏定性。", 
      career: "适合流动、变化大的工作，如贸易、旅游。",
      wealth: "财运波动大，但来去自如。",
      love: "需要寻找能给你安全感的人。",
      health: "注意肾脏和泌尿系统。",
      strength: 82, weak: "缺乏定性" 
    },
    "癸": { 
      title: "癸水命 - 雨露滋润", 
      description: "您是癸水命，如同雨露滋润柔和细腻。性格柔情，但有时过于依赖。", 
      career: "适合细腻、服务类工作，如医疗、教育。",
      wealth: "财运平稳，需稳定理财。",
      love: "柔情似水，容易遇到珍惜你的人。",
      health: "注意血液循环。",
      strength: 70, weak: "过于依赖" 
    },
  }

  return destines[dayGan] || { title: "未知", description: "命格分析待定", strength: 50, weak: "待探索" }
}

export default function BaziPage() {
  const [birthDate, setBirthDate] = useState("2000-01-01")
  const [birthHour, setBirthHour] = useState(23)
  const [gender, setGender] = useState<"male" | "female">("male")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof calculateBazi> | null>(null)
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeDestiny> | null>(null)

  const handleCalculate = async () => {
    if (!birthDate) return
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const date = new Date(birthDate)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    const bazi = calculateBazi(year, month, day, birthHour)
    const destinyAnalysis = analyzeDestiny(bazi)
    
    setResult(bazi)
    setAnalysis(destinyAnalysis)
    setIsLoading(false)
  }

  const handleShare = () => {
    if (result && analysis) {
      const text = `我是${result.yearGan}${result.yearZhi}年出生的${analysis.title}，快来测试你的八字！`
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
          <h1 className="font-serif text-2xl font-bold text-white">八字算命</h1>
        </div>

        {!result ? (
          <Card className="max-w-xl mx-auto border-white/10 bg-white/10 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center mb-4">
                <Gem className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="font-serif text-2xl text-white">探索你的命盘</CardTitle>
              <CardDescription className="text-white/70">
                输入出生信息，解析你的命运格局
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
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                      className="hidden"
                    />
                    <span className={gender === "male" ? "text-purple-400" : "text-white/70"}>♂️ 男</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${gender === "female" ? "bg-pink-500/30 border-pink-500" : "bg-white/10 border-white/20"} border`}>
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                      className="hidden"
                    />
                    <span className={gender === "female" ? "text-pink-400" : "text-white/70"}>♀️ 女</span>
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
                    正在解析你的命盘...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    开始算命
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-white/50">
                🚀 测试期无限次 · AI深度分析 · 准到离谱
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
            {/* 八字盘 */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <div className="text-6xl">🎴</div>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="font-serif text-4xl text-white">
                  {result.yearGan}{result.yearZhi}年 {result.monthGan}{result.monthZhi}月
                </CardTitle>
                <CardTitle className="font-serif text-5xl text-amber-400">
                  {result.dayGan}{result.dayZhi}日 {result.hourGan}{result.hourZhi}时
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: "年柱", gan: result.yearGan, zhi: result.yearZhi },
                    { name: "月柱", gan: result.monthGan, zhi: result.monthZhi },
                    { name: "日柱", gan: result.dayGan, zhi: result.dayZhi },
                    { name: "时柱", gan: result.hourGan, zhi: result.hourZhi },
                  ].map((item) => (
                    <div 
                      key={item.name}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-center"
                    >
                      <div className="text-xs text-white/50 mb-1">{item.name}</div>
                      <div className="text-2xl font-serif text-white">{item.gan}{item.zhi}</div>
                      <div className="text-xs mt-1" style={{ color: getWuxingColor(getWuxing(item.gan)) }}>
                        {getWuxing(item.gan)}{getWuxing(item.zhi)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 命主分析 */}
            {analysis && (
              <Card className="border-amber-500/30 bg-amber-500/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-400">
                    <Crown className="w-5 h-5" />
                    命主分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-serif text-white">{analysis.title}</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    {analysis.description}
                  </p>
                  
                  <div className="mt-4 p-4 rounded-xl bg-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70">命格强度</span>
                      <span className="text-amber-400 font-bold">{analysis.strength}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                        style={{ width: `${analysis.strength}%` }}
                      />
                    </div>
                    <div className="mt-3 text-sm text-white/50">
                      💡 注意：{analysis.weak}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 详细分析 - 付费解锁 */}
            <Card className="border-white/20 bg-white/5 backdrop-blur-xl">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-white flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  详细命理解读
                </CardTitle>
                <CardDescription className="text-white/50">
                  解锁查看完整的事业、财运、婚姻、健康分析
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 隐藏的内容预览 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-50">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">事业分析</span>
                    </div>
                    <p className="text-white/60 text-sm blur-sm">{analysis?.career}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-50">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">财运解读</span>
                    </div>
                    <p className="text-white/60 text-sm blur-sm">{analysis?.wealth}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-50">
                    <div className="flex items-center gap-2 text-rose-400 mb-2">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-medium">婚姻感情</span>
                    </div>
                    <p className="text-white/60 text-sm blur-sm">{analysis?.love}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-50">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">健康提示</span>
                    </div>
                    <p className="text-white/60 text-sm blur-sm">{analysis?.health}</p>
                  </div>
                </div>

                {/* 解锁按钮 */}
                <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600">
                  <Unlock className="w-4 h-4 mr-2" />
                  解锁完整命理解读
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setResult(null)}
                className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重新算命
              </Button>
              <Button 
                onClick={handleShare}
                className="flex-1 h-12 bg-gradient-to-r from-pink-500 to-purple-500"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享结果
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
