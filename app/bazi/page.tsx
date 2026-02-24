"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Calendar, Clock, User } from "lucide-react"
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
  const dayGanIndex = (day * 2 + 5) % 10  // 简化计算
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

// 命主分析
function analyzeDestiny(bazi: ReturnType<typeof calculateBazi>) {
  const dayGan = bazi.dayGan
  const dayZhi = bazi.dayZhi

  // 简化的命主分析
  const destines: Record<string, { title: string; description: string }> = {
    "甲": { title: "甲木命", description: "您是甲木命，如同参天大树，正直向上，有领导才能。性格仁厚，但有时过于固执。" },
    "乙": { title: "乙木命", description: "您是乙木命，如同藤蔓花草，柔韧灵活。性格温和，善于变通，但有时缺乏主见。" },
    "丙": { title: "丙火命", description: "您是丙火命，如同太阳之光，热情开朗。富有正义感，但有时过于冲动。" },
    "丁": { title: "丁火命", description: "您是丁火命，如同灯烛之火，细腻温柔。思想敏锐，但有时多愁善感。" },
    "戊": { title: "戊土命", description: "您是戊土命，如同高山厚土稳重可靠。性格踏实，但有时过于保守。" },
    "己": { title: "己土命", description: "您是己土命，如同田园之土，宽厚包容。性格稳重，但有时缺乏活力。" },
    "庚": { title: "庚金命", description: "您是庚金命，如同金铁之刚果断坚毅。性格刚强，但有时过于严厉。" },
    "辛": { title: "辛金命", description: "您是辛金命，如同珠玉之美精致细腻。性格敏锐，但有时过于敏感。" },
    "壬": { title: "壬水命", description: "您是壬水命，如同江河之水奔放自由。性格豁达，但有时缺乏定性。" },
    "癸": { title: "癸水命", description: "您是癸水命，如同雨露滋润柔和细腻。性格柔情，但有时过于依赖。" },
  }

  return destines[dayGan] || { title: "未知", description: "命格分析待定" }
}

export default function BaziPage() {
  const [birthDate, setBirthDate] = useState("")
  const [birthHour, setBirthHour] = useState(12)
  const [gender, setGender] = useState<"male" | "female">("male")
  const [result, setResult] = useState<ReturnType<typeof calculateBazi> | null>(null)
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeDestiny> | null>(null)

  const handleCalculate = () => {
    if (!birthDate) return
    const date = new Date(birthDate)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    const bazi = calculateBazi(year, month, day, birthHour)
    setResult(bazi)
    setAnalysis(analyzeDestiny(bazi))
  }

  return (
    <div className="min-h-screen relative">
      {/* 背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-background to-background" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 头部导航 */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-2xl font-bold">八字算命</h1>
        </div>

        {!result ? (
          // 输入表单
          <Card className="max-w-xl mx-auto border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                输入出生信息
              </CardTitle>
              <CardDescription>
                根据您的出生年、月、日、时，计算八字命盘
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 出生日期 */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  出生日期
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/10 text-white"
                />
              </div>

              {/* 出生时辰 */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  出生时辰
                </label>
                <select
                  value={birthHour}
                  onChange={(e) => setBirthHour(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/10 text-white"
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

              {/* 性别 */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  性别
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                      className="w-4 h-4"
                    />
                    <span>男</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                      className="w-4 h-4"
                    />
                    <span>女</span>
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={!birthDate}
              >
                开始算命
              </Button>
            </CardContent>
          </Card>
        ) : (
          // 结果展示
          <div className="max-w-2xl mx-auto space-y-6">
            {/* 八字盘 */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center font-serif text-3xl">
                  {result.yearGan}{result.yearZhi}年 {result.monthGan}{result.monthZhi}月
                </CardTitle>
                <CardTitle className="text-center font-serif text-4xl text-gold-400">
                  {result.dayGan}{result.dayZhi}日 {result.hourGan}{result.hourZhi}时
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="text-xs text-muted-foreground mb-1">年柱</div>
                    <div className="text-2xl font-serif">{result.yearGan}{result.yearZhi}</div>
                    <div className="text-sm text-purple-400">{getWuxing(result.yearGan)}{getWuxing(result.yearZhi)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="text-xs text-muted-foreground mb-1">月柱</div>
                    <div className="text-2xl font-serif">{result.monthGan}{result.monthZhi}</div>
                    <div className="text-sm text-purple-400">{getWuxing(result.monthGan)}{getWuxing(result.monthZhi)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="text-xs text-muted-foreground mb-1">日柱</div>
                    <div className="text-2xl font-serif">{result.dayGan}{result.dayZhi}</div>
                    <div className="text-sm text-purple-400">{getWuxing(result.dayGan)}{getWuxing(result.dayZhi)}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <div className="text-xs text-muted-foreground mb-1">时柱</div>
                    <div className="text-2xl font-serif">{result.hourGan}{result.hourZhi}</div>
                    <div className="text-sm text-purple-400">{getWuxing(result.hourGan)}{getWuxing(result.hourZhi)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 命主分析 */}
            {analysis && (
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold-400" />
                    命主分析
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-serif text-gold-400">{analysis.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {analysis.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 付费提示 */}
            <Card className="border-gold-500/30 bg-gold-500/5">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">解锁完整命理解读</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  升级VIP会员，查看详细的事业、财运、婚姻分析
                </p>
                <Button className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700">
                  立即解锁 (¥29/月)
                </Button>
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              onClick={() => setResult(null)}
              className="w-full"
            >
              重新算命
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
