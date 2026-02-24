"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Calendar, Clock, User, Loader2, Share2, RefreshCw, Gem, Crown } from "lucide-react"
import Link from "next/link"

// 八字计算相关的常量
const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

// 五行
const WUXING = ["木", "火", "土", "金", "水"]

// 八字计算函数
function calculateBazi(year: number, month: number, day: number, hour: number) {
  // 简化的八字计算（实际需要考虑更多历法因素）
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

// 命主分析
function analyzeDestiny(bazi: ReturnType<typeof calculateBazi>) {
  const dayGan = bazi.dayGan
  const dayZhi = bazi.dayZhi

  const destines: Record<string, { title: string; description: string; strength: number; weak: string }> = {
    "甲": { title: "甲木命 - 参天大树", description: "您是甲木命，如同参天大树，正直向上，有领导才能。性格仁厚，但有时过于固执。", strength: 85, weak: "过于刚直" },
    "乙": { title: "乙木命 - 藤蔓花草", description: "您是乙木命，如同藤蔓花草，柔韧灵活。性格温和，善于变通，但有时缺乏主见。", strength: 78, weak: "缺乏决断" },
    "丙": { title: "丙火命 - 太阳之光", description: "您是丙火命，如同太阳之光，热情开朗。富有正义感，但有时过于冲动。", strength: 92, weak: "易冲动" },
    "丁": { title: "丁火命 - 灯烛之火", description: "您是丁火命，如同灯烛之火，细腻温柔。思想敏锐，但有时多愁善感。", strength: 75, weak: "敏感细腻" },
    "戊": { title: "戊土命 - 高山厚土", description: "您是戊土命，如同高山厚土稳重可靠。性格踏实，但有时过于保守。", strength: 88, weak: "过于保守" },
    "己": { title: "己土命 - 田园之土", description: "您是己土命，如同田园之土，宽厚包容。性格稳重，但有时缺乏活力。", strength: 72, weak: "缺乏活力" },
    "庚": { title: "庚金命 - 金铁之刚", description: "您是庚金命，如同金铁之刚果断坚毅。性格刚强，但有时过于严厉。", strength: 95, weak: "过于严厉" },
    "辛": { title: "辛金命 - 珠玉之美", description: "您是辛金命，如同珠玉之美精致细腻。性格敏锐，但有时过于敏感。", strength: 80, weak: "过于敏感" },
    "壬": { title: "壬水命 - 江河之水", description: "您是壬水命，如同江河之水奔放自由。性格豁达，但有时缺乏定性。", strength: 82, weak: "缺乏定性" },
    "癸": { title: "癸水命 - 雨露滋润", description: "您是癸水命，如同雨露滋润柔和细腻。性格柔情，但有时过于依赖。", strength: 70, weak: "过于依赖" },
  }

  return destines[dayGan] || { title: "未知", description: "命格分析待定", strength: 50, weak: "待探索" }
}

export default function BaziPage() {
  const [birthDate, setBirthDate] = useState("")
  const [birthHour, setBirthHour] = useState(12)
  const [gender, setGender] = useState<"male" | "female">("male")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof calculateBazi> | null>(null)
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeDestiny> | null>(null)

  const handleCalculate = async () => {
    if (!birthDate) return
    setIsLoading(true)
    
    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
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
      
      {/* 背景装饰 */}
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
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  出生时辰
                </label>
                <select
                  value={birthHour}
                  onChange={(e) => setBirthHour(Number(e.target.value))}
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white"
                >
                  <option value={23}>子时 (23:00-01:00)</option>
                  <option value={1}>丑时 (01:00-03:00)</option>
                  <option value={3}>寅时 (03:00-05:00)</option>
                  <option value={5}>卯时 (05:00-07:00)</option>
                  <option value={7}>辰时 (07:00-09:00)</option>
                  <option value={9}>巳时 (09:00-11:00)</option>
                  <option value={11}>午时 (11:00-13:00)</option>
                  <option value={13}>未时 (13:00-15:00)</option>
                  <option value={15}>申时 (15:00-17:00)</option>
                  <option value={17}>酉时 (17:00-19:00)</option>
                  <option value={19}>戌时 (19:00-21:00)</option>
                  <option value={21}>亥时 (21:00-23:00)</option>
                </select>
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
                免费解析 · 每日限3次 · 精准分析
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
                  
                  {/* 命格强度 */}
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

            {/* 付费提示 */}
            <Card className="border-purple-500/30 bg-purple-500/10 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">解锁完整命理解读</h3>
                <p className="text-sm text-white/60 mb-4">
                  升级VIP会员，查看详细的事业、财运、婚姻分析
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Crown className="w-4 h-4 mr-2" />
                  立即解锁 (¥29/月)
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
