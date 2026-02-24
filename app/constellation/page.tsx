"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, ArrowLeft, Sparkles, Heart, Briefcase, TrendingUp } from "lucide-react"
import Link from "next/link"

// 十二星座数据
const CONSTELLATIONS = [
  { name: "白羊座", symbol: "♈", date: "3.21-4.19", element: "火", mode: "开创" },
  { name: "金牛座", symbol: "♉", date: "4.20-5.20", element: "土", mode: "固定" },
  { name: "双子座", symbol: "♊", date: "5.21-6.21", element: "风", mode: "变动" },
  { name: "巨蟹座", symbol: "♋", date: "6.22-7.22", element: "水", mode: "开创" },
  { name: "狮子座", symbol: "♌", date: "7.23-8.22", element: "火", mode: "固定" },
  { name: "处女座", symbol: "♍", date: "8.23-9.22", element: "土", mode: "变动" },
  { name: "天秤座", symbol: "♎", date: "9.23-10.23", element: "风", mode: "开创" },
  { name: "天蝎座", symbol: "♏", date: "10.24-11.22", element: "水", mode: "固定" },
  { name: "射手座", symbol: "♐", date: "11.23-12.21", element: "火", mode: "变动" },
  { name: "摩羯座", symbol: "♑", date: "12.22-1.19", element: "土", mode: "开创" },
  { name: "水瓶座", symbol: "♒", date: "1.20-2.18", element: "风", mode: "固定" },
  { name: "双鱼座", symbol: "♓", date: "2.19-3.20", element: "水", mode: "变动" },
]

// 根据日期获取星座
function getConstellation(month: number, day: number): typeof CONSTELLATIONS[0] {
  const dates = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22]
  const names = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const index = month - 1
  const n = dates[index]
  return day < n ? names[index - 1 < 0 ? 11 : index - 1] : names[index]
}

// 运势数据（简化版）
function getFortune(constellation: string) {
  const fortunes: Record<string, {
    overall: string
    love: string
    career: string
    wealth: string
    luckyColor: string
    luckyNumber: number
  }> = {
    "白羊座": {
      overall: "今天运势不错，适合主动出击。工作中可能会有新的机会出现，建议把握住。",
      love: "单身者有机会遇到心仪的对象，已有伴侣者感情稳定。",
      career: "工作积极性高，适合处理重要任务。",
      wealth: "财运平稳，投资需谨慎。",
      luckyColor: "红色",
      luckyNumber: 7,
    },
    "金牛座": {
      overall: "今天适合稳扎稳打，不宜冒险。财运不错，可能有意外收获。",
      love: "感情运势良好，适合增进与伴侣的感情。",
      career: "工作顺利，但要注意细节。",
      wealth: "偏财运佳，可以适当参与投资。",
      luckyColor: "绿色",
      luckyNumber: 6,
    },
    "双子座": {
      overall: "今天思维活跃，适合创意工作。人际交往顺利，容易结交新朋友。",
      love: "社交活动增多，桃花运上升。",
      career: "适合沟通协调类工作。",
      wealth: "财运一般，需控制消费。",
      luckyColor: "黄色",
      luckyNumber: 3,
    },
    "巨蟹座": {
      overall: "今天情绪敏感，需要注意与家人的沟通。适合处理家庭事务。",
      love: "家庭氛围和谐，单身者可通过家人介绍认识新人。",
      career: "工作平稳，不宜做出重大决定。",
      wealth: "财运普通，注意理财。",
      luckyColor: "银色",
      luckyNumber: 2,
    },
    "狮子座": {
      overall: "今天魅力四射，适合展现自我。有机会成为焦点人物。",
      love: "自信满满，桃花运旺盛。",
      career: "领导能力得到体现，适合主导项目。",
      wealth: "正财运佳，可能有加薪机会。",
      luckyColor: "金色",
      luckyNumber: 1,
    },
    "处女座": {
      overall: "今天适合处理细节工作，注意劳逸结合。健康需要关注。",
      love: "对感情要求较高，容易挑剔。",
      career: "工作细致入微，获得好评。",
      wealth: "财运平稳，适宜储蓄。",
      luckyColor: "白色",
      luckyNumber: 5,
    },
    "天秤座": {
      overall: "今天人际关系和谐，适合团队合作。艺术灵感丰富。",
      love: "社交活动丰富，容易遇到有缘人。",
      career: "适合协调类工作，艺术领域有突破。",
      wealth: "财运上升，可能有礼物收入。",
      luckyColor: "粉色",
      luckyNumber: 4,
    },
    "天蝎座": {
      overall: "今天直觉敏锐，适合深入研究。感情上有进展。",
      love: "感情运势强烈，容易陷入热恋。",
      career: "适合需要洞察力的工作。",
      wealth: "偏财运佳，可能中奖。",
      luckyColor: "黑色",
      luckyNumber: 8,
    },
    "射手座": {
      overall: "今天活力十足，适合运动和旅行。思想开阔，收获丰富。",
      love: "乐观积极，桃花运不错。",
      career: "适合拓展新业务。",
      wealth: "财运波动较大，谨慎投资。",
      luckyColor: "紫色",
      luckyNumber: 9,
    },
    "摩羯座": {
      overall: "今天事业心强，适合规划未来。脚踏实地的努力会有回报。",
      love: "感情内敛，需要主动表达。",
      career: "工作运势旺盛，地位有望提升。",
      wealth: "正财运稳定，适宜长期投资。",
      luckyColor: "棕色",
      luckyNumber: 4,
    },
    "水瓶座": {
      overall: "今天创意十足，适合创新项目。独立思考有新发现。",
      love: "追求自由，可能逃避感情责任。",
      career: "适合创意类工作。",
      wealth: "财运平稳，适宜创新投资。",
      luckyColor: "蓝色",
      luckyNumber: 3,
    },
    "双鱼座": {
      overall: "今天感性丰富，适合艺术创作。想象力丰富，灵感不断。",
      love: "感情丰富，容易陷入浪漫。",
      career: "艺术创作运势佳。",
      wealth: "财运一般，需要开源节流。",
      luckyColor: "海蓝色",
      luckyNumber: 7,
    },
  }
  return fortunes[constellation] || fortunes["白羊座"]
}

export default function ConstellationPage() {
  const [birthDate, setBirthDate] = useState("")
  const [result, setResult] = useState<{
    constellation: typeof CONSTELLATIONS[0]
    fortune: ReturnType<typeof getFortune>
  } | null>(null)

  const handleCalculate = () => {
    if (!birthDate) return
    const date = new Date(birthDate)
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    const constellation = getConstellation(month, day)
    const fortune = getFortune(constellation.name)
    setResult({ constellation, fortune })
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-background to-background" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-2xl font-bold">星座运势</h1>
        </div>

        {!result ? (
          <Card className="max-w-xl mx-auto border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-400" />
                输入出生日期
              </CardTitle>
              <CardDescription>
                根据您的出生日期，查询星座运势
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">出生日期</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/10 text-white"
                />
              </div>

              <Button 
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                disabled={!birthDate}
              >
                查询运势
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="text-6xl mb-4">{result.constellation.symbol}</div>
                <CardTitle className="font-serif text-3xl">{result.constellation.name}</CardTitle>
                <CardDescription>{result.constellation.date}</CardDescription>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <span className="px-3 py-1 rounded-full bg-white/10">
                    {result.constellation.element}象
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10">
                    {result.constellation.mode}星座
                  </span>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  今日运势
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {result.fortune.overall}
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    爱情运
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{result.fortune.love}</p>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    事业运
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{result.fortune.career}</p>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gold-400" />
                    财运
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{result.fortune.wealth}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6 flex justify-around text-center">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">幸运颜色</div>
                  <div className="text-xl font-semibold text-blue-400">{result.fortune.luckyColor}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">幸运数字</div>
                  <div className="text-xl font-semibold text-gold-400">{result.fortune.luckyNumber}</div>
                </div>
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              onClick={() => setResult(null)}
              className="w-full"
            >
              重新查询
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
