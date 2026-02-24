"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Star, Sparkle, Loader2, Share2, RefreshCw, Heart } from "lucide-react"
import Link from "next/link"

// 十二星座数据
const CONSTELLATIONS = [
  { name: "白羊座", symbol: "♈", date: "3.21-4.19", element: "火", mode: "开创", color: "#FF6B6B" },
  { name: "金牛座", symbol: "♉", date: "4.20-5.20", element: "土", mode: "固定", color: "#4ECDC4" },
  { name: "双子座", symbol: "♊", date: "5.21-6.21", element: "风", mode: "变动", color: "#FFE66D" },
  { name: "巨蟹座", symbol: "♋", date: "6.22-7.22", element: "水", mode: "开创", color: "#95E1D3" },
  { name: "狮子座", symbol: "♌", date: "7.23-8.22", element: "火", mode: "固定", color: "#F38181" },
  { name: "处女座", symbol: "♍", date: "8.23-9.22", element: "土", mode: "变动", color: "#DDA0DD" },
  { name: "天秤座", symbol: "♎", date: "9.23-10.23", element: "风", mode: "开创", color: "#FFB347" },
  { name: "天蝎座", symbol: "♏", date: "10.24-11.22", element: "水", mode: "固定", color: "#9B59B6" },
  { name: "射手座", symbol: "♐", date: "11.23-12.21", element: "火", mode: "变动", color: "#E74C3C" },
  { name: "摩羯座", symbol: "♑", date: "12.22-1.19", element: "土", mode: "开创", color: "#8B4513" },
  { name: "水瓶座", symbol: "♒", date: "1.20-2.18", element: "风", mode: "固定", color: "#3498DB" },
  { name: "双鱼座", symbol: "♓", date: "2.19-3.20", element: "水", mode: "变动", color: "#1ABC9C" },
]

// 根据日期获取星座（修复版）
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

// 运势数据
function getFortune(constellation: string, date: Date) {
  const fortunes: Record<string, any> = {
    "白羊座": { overall: "今天你的能量充沛，行动力十足！火星给予你勇气和活力，适合开展新项目或做出重要决定。保持积极的心态，好运自然会来找你。", love: "单身者有望在社交场合遇到心动对象，已有伴侣者感情升温。", career: "工作上适合主动出击，展现你的领导才能。", wealth: "财运不错，可能有意外收获，但要避免冲动消费。", luckyColor: "红色", luckyNumber: 7, tip: "相信直觉，勇敢迈出第一步" },
    "金牛座": { overall: "今天适合稳扎稳打，享受生活的美好。金星的守护让你魅力四射，财运也相当不错。放慢脚步，感受当下的幸福。", love: "感情稳定，适合与伴侣规划未来。", career: "工作顺利，你的耐心和细心会受到赞赏。", wealth: "偏财运佳，可以关注一下投资机会。", luckyColor: "绿色", luckyNumber: 6, tip: "耐心等待，美好即将到来" },
    "双子座": { overall: "今天思维活跃，创意无限！多与人交流沟通，会给你带来意想不到的灵感。保持好奇心，探索未知领域。", love: "社交活跃，桃花运上升，容易结识新朋友。", career: "适合需要创意和沟通的工作。", wealth: "财运平稳，注意控制支出。", luckyColor: "黄色", luckyNumber: 3, tip: "分享你的想法，获得更多支持" },
    "巨蟹座": { overall: "今天适合关注家庭和情感。月亮的影响让你变得感性，与家人朋友的联系会更加紧密。给自己一些独处的时间也很好。", love: "家庭氛围和谐，单身者可接受家人介绍。", career: "工作平稳，不宜冒险。", wealth: "财运普通，适宜储蓄。", luckyColor: "银色", luckyNumber: 2, tip: "关爱自己，善待身边的人" },
    "狮子座": { overall: "今天你是主角！太阳的光辉照耀着你，展现自我的时候到了。自信和魅力会为你带来好运，抓住机会发光发热。", love: "自信满满，桃花运旺盛，容易成为焦点。", career: "领导能力得到体现，适合主导项目。", wealth: "正财运佳，可能有加薪或奖励。", luckyColor: "金色", luckyNumber: 1, tip: "展现你的热情，感染周围的人" },
    "处女座": { overall: "今天适合处理细节和规划。水星的加持让你思维清晰，工作效率提升。注意劳逸结合，保持身心健康。", love: "对感情要求较高，但缘分天注定。", career: "工作细致入微，获得上级认可。", wealth: "财运平稳，适合规划理财。", luckyColor: "白色", luckyNumber: 5, tip: "完美主义者也要学会放松" },
    "天秤座": { overall: "今天人际关系和谐是你的优势。金星的守护让你更具魅力，艺术灵感丰富，适合发挥创造力。", love: "社交活动丰富，容易遇到有缘人。", career: "适合协调和艺术类工作。", wealth: "财运上升，可能有礼物或惊喜。", luckyColor: "粉色", luckyNumber: 4, tip: "平衡是生活的艺术" },
    "天蝎座": { overall: "今天直觉敏锐，洞察力增强。冥王星的力量让你更加深入地探索事物本质，适合研究和分析工作。", love: "感情运势强烈，容易陷入热恋。", career: "适合需要洞察力的工作。", wealth: "偏财运佳，可能有意外收获。", luckyColor: "深红色", luckyNumber: 8, tip: "跟随内心的直觉" },
    "射手座": { overall: "今天活力十足，乐观积极！木星赐予你好运，适合运动、旅行和学习新事物。思想开阔，会有新的领悟。", love: "心态开放，桃花运不错。", career: "适合拓展和冒险类工作。", wealth: "财运波动，谨慎投资。", luckyColor: "紫色", luckyNumber: 9, tip: "走出去，世界很大" },
    "摩羯座": { overall: "今天事业心强，适合规划未来。土星给你稳定的力量，脚踏实地的努力会有回报。耐心是成功的关键。", love: "感情内敛，需要主动表达。", career: "工作运势旺盛，地位有望提升。", wealth: "正财运稳定，适合长期投资。", luckyColor: "深灰色", luckyNumber: 4, tip: "坚持就是胜利" },
    "水瓶座": { overall: "今天创意十足，独具慧眼。天王星激发你的创新思维，适合打破常规，展现独特的想法。", love: "追求自由，但也要珍惜眼前人。", career: "适合创意和科技类工作。", wealth: "财运平稳，注意理财。", luckyColor: "天蓝色", luckyNumber: 3, tip: "与众不同是你的魅力" },
    "双鱼座": { overall: "今天感性丰富，想象力爆棚！海王星给你灵感和创意，艺术创作运势极佳。跟随梦想前行。", love: "感情丰富，容易遇到浪漫邂逅。", career: "艺术创作运势佳。", wealth: "财运一般，需要开源节流。", luckyColor: "海蓝色", luckyNumber: 7, tip: "保持纯真，梦想会成真" },
  }
  
  const baseFortune = fortunes[constellation] || fortunes["白羊座"]
  // 根据日期生成不同的运势（每天不同）
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const variation = dayOfYear % 3
  
  return {
    ...baseFortune,
    overall: baseFortune.overall + (variation === 0 ? " ✨ 今天有特别的惊喜等着你！" : variation === 1 ? " 💫 保持开放的心态，好运连连！" : " 🌟 相信奇迹会发生！"),
    rank: (dayOfYear % 12) + 1
  }
}

// 庆祝动画组件
function CelebrationEffect({ onComplete }: { onComplete?: () => void }) {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, emoji: string}>>([])
  
  useEffect(() => {
    const emojis = ["✨", "⭐", "💫", "🌟", "💖", "🎉"]
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }))
    setParticles(newParticles)
    
    const timer = setTimeout(() => {
      onComplete?.()
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-celebrate text-2xl"
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

// 背景星星
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

export default function ConstellationPage() {
  const [birthDate, setBirthDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [result, setResult] = useState<{
    constellation: typeof CONSTELLATIONS[0]
    fortune: ReturnType<typeof getFortune>
  } | null>(null)

  const handleCalculate = async () => {
    if (!birthDate) return
    
    setIsLoading(true)
    setShowResult(false)
    
    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const date = new Date(birthDate)
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    const constellation = getConstellation(month, day)
    const fortune = getFortune(constellation.name, date)
    
    setResult({ constellation, fortune })
    setIsLoading(false)
    setShowCelebration(true)
    setShowResult(true)
  }

  const handleShare = () => {
    if (navigator.share && result) {
      navigator.share({
        title: `我的星座是${result.constellation.name}`,
        text: `我是${result.constellation.name}，今日运势排名第${result.fortune.rank}位！`,
        url: window.location.href,
      })
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(`我是${result?.constellation.name}，今日运势排名第${result?.fortune.rank}位！`)
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
          <h1 className="font-serif text-2xl font-bold text-white">星座运势</h1>
        </div>

        {showCelebration && <CelebrationEffect onComplete={() => setShowCelebration(false)} />}

        {!showResult ? (
          <Card className="max-w-xl mx-auto border-white/10 bg-white/10 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4">
                <Star className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="font-serif text-2xl text-white">探索你的星座</CardTitle>
              <CardDescription className="text-white/70">
                输入出生日期，解密你的命运密码
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">出生日期</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              <Button 
                onClick={handleCalculate}
                disabled={!birthDate || isLoading}
                className="w-full h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-lg font-semibold rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    正在探索你的星座...
                  </>
                ) : (
                  <>
                    <Sparkle className="w-5 h-5 mr-2" />
                    立即探索
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-white/50">
                免费探索 · 每日限3次 · 精准解析
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
            {/* 星座卡片 */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-xl overflow-hidden">
              <div 
                className="h-32 flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, ${result?.constellation.color}40, transparent)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="relative z-10 text-8xl animate-float">{result?.constellation.symbol}</div>
              </div>
              <CardHeader className="text-center -mt-12 relative z-10">
                <CardTitle className="font-serif text-4xl text-white">{result?.constellation.name}</CardTitle>
                <CardDescription className="text-white/70 text-lg">{result?.constellation.date}</CardDescription>
                <div className="flex justify-center gap-3 mt-4">
                  <span 
                    className="px-4 py-1.5 rounded-full text-sm font-medium"
                    style={{ backgroundColor: `${result?.constellation.color}30`, color: result?.constellation.color }}
                  >
                    {result?.constellation.element}象
                  </span>
                  <span 
                    className="px-4 py-1.5 rounded-full text-sm font-medium"
                    style={{ backgroundColor: `${result?.constellation.color}30`, color: result?.constellation.color }}
                  >
                    {result?.constellation.mode}星座
                  </span>
                </div>
              </CardHeader>
            </Card>

            {/* 运势排名 */}
            <Card className="border-yellow-500/30 bg-yellow-500/10 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <div className="text-sm text-yellow-400 mb-2">今日运势排名</div>
                <div className="text-5xl font-bold text-yellow-400">第 {result?.fortune.rank} 名</div>
                <div className="text-white/60 mt-2">超越全国{((12 - (result?.fortune.rank || 1)) / 12 * 100).toFixed(0)}%的星座</div>
              </CardContent>
            </Card>

            {/* 今日运势 */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  今日运势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed text-lg">
                  {result?.fortune.overall}
                </p>
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/60 mb-1">💡 今日建议</div>
                  <div className="text-white/90">{result?.fortune.tip}</div>
                </div>
              </CardContent>
            </Card>

            {/* 三维运势 */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-rose-500/20 bg-rose-500/10 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-rose-400">
                    <Heart className="w-4 h-4" />
                    爱情运
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm">{result?.fortune.love}</p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-blue-500/10 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
                    <Star className="w-4 h-4" />
                    事业运
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm">{result?.fortune.career}</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-500/20 bg-yellow-500/10 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-yellow-400">
                    <Sparkle className="w-4 h-4" />
                    财运
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm">{result?.fortune.wealth}</p>
                </CardContent>
              </Card>
            </div>

            {/* 幸运元素 */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-xl">
              <CardContent className="p-6 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-2">幸运颜色</div>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: result?.constellation.color }}
                  >
                    {result?.fortune.luckyColor}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-white/60 mb-2">幸运数字</div>
                  <div className="text-2xl font-bold text-yellow-400">{result?.fortune.luckyNumber}</div>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowResult(false)}
                className="flex-1 h-12 border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                再测一次
              </Button>
              <Button 
                onClick={handleShare}
                className="flex-1 h-12 bg-gradient-to-r from-pink-500 to-purple-500"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享结果
              </Button>
            </div>

            <Link href="/" className="block">
              <Button variant="ghost" className="w-full text-white/60 hover:text-white">
                返回首页探索更多
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
