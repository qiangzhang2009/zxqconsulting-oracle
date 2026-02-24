"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, ArrowLeft, Sparkles, RefreshCw, Heart, Loader2 } from "lucide-react"
import Link from "next/link"

// 六十四卦数据（简化版）
const HEXAGRAMS = [
  { name: "乾卦", symbol: "☰", meaning: "元亨利贞", description: "象征天，代表创造、领导、刚健。卦辞：元亨利贞。", interpretation: "大吉之卦诸事顺利。此时正是发挥才能的好时机，要敢于行动，把握机遇。但需保持中正之心，不可过于骄傲。" },
  { name: "坤卦", symbol: "☷", meaning: "元亨，利牝马之贞", description: "象征地，代表柔顺、承载、包容。卦辞：元亨，利牝马之贞。", interpretation: "吉祥之卦，柔顺中正。适合以柔克刚，以静制动。保持谦逊和耐心，稳步前进。" },
  { name: "屯卦", symbol: "☵", meaning: "元亨利贞，勿用有攸往，利建侯", description: "象征起始、困难。卦辞：元亨利贞，勿用有攸往，利建侯。", interpretation: "创业之卦，初始艰难。万事开头难，此时应积聚力量，不可急于求成。耐心等待时机，最终会获得成功。" },
  { name: "蒙卦", symbol: "☶", meaning: "亨，匪我求童蒙，童蒙求我", description: "象征启蒙、蒙昧。卦辞：亨，匪我求童蒙，童蒙求我。", interpretation: "启蒙之卦。求学问道的好时机，但需要虚心请教。适合学习新知识，提升自己的能力。" },
  { name: "需卦", symbol: "☴", meaning: "有孚，光亨，贞吉，利涉大川", description: "象征等待、需求。卦辞：有孚，光亨，贞吉，利涉大川。", interpretation: "等待之卦，耐心等待必有后福。此时应养精蓄锐，等待合适时机再行动。不可冒险急躁。" },
  { name: "讼卦", symbol: "☔", meaning: "有孚窒惕，中吉，终凶", description: "象征诉讼、争执。卦辞：有孚窒惕，中吉，终凶。", interpretation: "争执之卦，宜和解不宜争讼。近期应避免与人发生冲突，以和为贵。遇到纠纷应寻求调解。" },
  { name: "师卦", symbol: "☷☵", meaning: "贞丈人吉，无咎", description: "象征军队、战争。卦辞：贞丈人吉，无咎。", interpretation: "统率之卦，适合领导者。适合指挥、领导工作，但需正义行事，爱护下属。" },
  { name: "比卦", symbol: "☵☷", meaning: "吉，原筮元永贞，无咎", description: "象征亲密、比较。卦辞：吉，原筮元永贞，无咎。", interpretation: "亲比之卦，人际和谐。适合结交朋友，建立合作关系。真诚待人，必得贵人相助。" },
  { name: "小畜卦", symbol: "☴☰", meaning: "亨，密云不雨，自我西郊", description: "象征积累、小亨。卦辞：亨，密云不雨，自我西郊。", interpretation: "小成之卦，积少成多。财运稳定，但进展较慢。需要耐心积累，不可急功近利。" },
  { name: "履卦", symbol: "☰☴", meaning: "履虎尾，不咥人，亨", description: "象征履行、踩踏。卦辞：履虎尾，不咥人，亨。", interpretation: "践履之卦，有惊无险。虽处险境但只要谨慎行事，就能化险为夷。切记小心谨慎。" },
]

// 随机生成卦象
function randomHexagram() {
  const index = Math.floor(Math.random() * HEXAGRAMS.length)
  return HEXAGRAMS[index]
}

// 硬币占卜模拟
function tossCoins(): number {
  // 抛三枚硬币，正面为3，反面为2
  // 总和为6、7、8、9
  // 6=老阴（变阴），7=少阳（不变），8=少阴（不变），9=老阳（变阳）
  const sum = [3, 2][Math.floor(Math.random() * 2)] + 
              [3, 2][Math.floor(Math.random() * 2)] + 
              [3, 2][Math.floor(Math.random() * 2)]
  return sum
}

export default function ZhouyiPage() {
  const [question, setQuestion] = useState("")
  const [isTossing, setIsTossing] = useState(false)
  const [result, setResult] = useState<typeof HEXAGRAMS[0] | null>(null)
  const [tossHistory, setTossHistory] = useState<number[]>([])
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleToss = async () => {
    if (!question.trim()) {
      alert("请先输入您的问题")
      return
    }
    
    setIsTossing(true)
    
    // 模拟抛硬币动画
    for (let i = 0; i < 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 300))
      const result = tossCoins()
      setTossHistory(prev => [...prev.slice(-5), result])
    }
    
    const hexagram = randomHexagram()
    setResult(hexagram)
    setIsTossing(false)
  }

  const handleReset = () => {
    setQuestion("")
    setResult(null)
    setTossHistory([])
    setIsSaved(false)
  }

  // 保存周易记录
  const handleSave = async () => {
    if (!result || isSaved) return
    
    setIsSaving(true)
    try {
      const response = await fetch('/api/zhouyi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question,
          hexagramName: result.name,
          hexagramSymbol: result.symbol,
          meaning: result.meaning,
          description: result.description,
          interpretation: result.interpretation,
          readingType: 'coin'
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setIsSaved(true)
        alert('已保存到你的周易记录中！')
      }
    } catch (error) {
      console.error('保存错误:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-2xl font-bold">周易占卜</h1>
        </div>

        {!result ? (
          <Card className="max-w-xl mx-auto border-stone-700 bg-stone-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Sun className="w-5 h-5" />
                心诚则灵
              </CardTitle>
              <CardDescription className="text-stone-400">
                心中默念您的问题，抛掷三枚铜钱进行占卜
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-300">您的问题</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="请默念您想占卜的问题..."
                  className="w-full h-24 px-3 py-2 rounded-md bg-stone-700/50 border border-stone-600 text-stone-100 placeholder:text-stone-500 resize-none"
                />
              </div>

              {/* 抛硬币结果显示 */}
              {tossHistory.length > 0 && (
                <div className="flex justify-center gap-2">
                  {tossHistory.slice(-3).map((val, idx) => (
                    <div 
                      key={idx}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                        ${val === 6 || val === 9 ? 'bg-red-900/50 text-red-300' : 
                          val === 7 ? 'bg-amber-900/50 text-amber-300' : 'bg-stone-700/50 text-stone-300'}`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={handleToss}
                disabled={isTossing || !question.trim()}
                className="w-full bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white shadow-lg shadow-red-900/20"
              >
                {isTossing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    正在占卜...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    开始占卜
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-stone-500">
                每日可免费占卜3次
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-stone-700 bg-stone-800/50 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="text-8xl mb-4">{result.symbol}</div>
                <CardTitle className="font-serif text-3xl text-amber-400">{result.name}</CardTitle>
                <CardDescription className="text-stone-400 text-lg">{result.meaning}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-stone-700 bg-stone-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-amber-400">卦辞</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-300 leading-relaxed">
                  {result.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  解卦
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-amber-200/80">
                  {result.interpretation}
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                重新占卜
              </Button>
              
              {/* 保存按钮 */}
              <Button 
                onClick={handleSave}
                disabled={isSaved || isSaving}
                className={`flex-1 ${
                  isSaved 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : ''
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
              
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  返回首页
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
