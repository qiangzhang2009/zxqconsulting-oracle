"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gem, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

// 塔罗牌数据（简化版22张大阿尔卡纳）
const TAROT_CARDS = [
  { name: "愚人", number: 0, keywords: "新的开始、自由、冒险", meaning: "愚人牌象征着新的开始和无限的可能。你正处于一个大胆冒险的起点，尽管前方未知，但你的热情和勇气将指引你前进。相信直觉，拥抱未知。" },
  { name: "魔术师", number: 1, keywords: "创造力、意志力、技能", meaning: "魔术师牌代表着你拥有实现目标所需的所有技能和资源。现在是时候运用你的能力和创造力来将梦想变为现实。相信自己的能力，你拥有一切所需的工具。" },
  { name: "女祭司", number: 2, keywords: "直觉、智慧、内在", meaning: "女祭司牌提醒你倾听内心的声音。在这个时刻，内在的智慧比外在的行动更重要。退一步海阔天空，让直觉引导你的决定。" },
  { name: "皇后", number: 3, keywords: "丰盛、母性、创造力", meaning: "皇后牌象征着丰盛和创造力。你现在处于一个充满创造力的时期，无论是艺术项目还是生活中，都有可能迎来丰收。拥抱你的女性能量。" },
  { name: "皇帝", number: 4, keywords: "权威、稳定、结构", meaning: "皇帝牌代表着权威和稳定。你需要建立秩序和结构，或者在生活中展现领导能力。保持自律和理性，你将获得成功。" },
  { name: "教皇", number: 5, keywords: "传统、教导、信念", meaning: "教皇牌提醒你遵循传统价值观或在某个领域寻求指导。现在是学习新知识或接受他人建议的好时机。团结和社群对你很重要。" },
  { name: "恋人", number: 6, keywords: "爱情、选择、和谐", meaning: "恋人牌象征着爱情和重要的选择。你可能面临一个需要做出抉择的时刻。跟随内心的选择，保持和谐的人际关系。" },
  { name: "战车", number: 7, keywords: "胜利、意志、决心", meaning: "战车牌代表着胜利和克服障碍。你有足够的意志力和决心去赢得胜利。保持专注，不要放弃，你将到达目的地。" },
  { name: "力量", number: 8, keywords: "勇气、耐心、内在力量", meaning: "力量牌提醒你，真正的力量来自内心而非外在。运用你的耐心和勇气，以温和的方式面对挑战。你比想象中更强大。" },
  { name: "隐士", number: 9, keywords: "内省、智慧、指引", meaning: "隐士牌象征着内省和寻求内在智慧。现在是时候退一步，独自思考人生方向。答案就在你心中，只是需要安静下来聆听。" },
  { name: "命运之轮", number: 10, keywords: "转变、命运、机遇", meaning: "命运之轮提醒你，生活中的转变正在进行中。新的机遇即将出现。保持开放的心态，接受变化，好运即将降临。" },
  { name: "正义", number: 11, keywords: "平衡、真理、因果", meaning: "正义牌代表着平衡和因果报应。你的行动将会得到相应的结果。保持诚实和正直，让真相和公正指引你的决定。" },
  { name: "倒吊人", number: 12, keywords: "牺牲、等待、新视角", meaning: "倒吊人牌象征着暂停和等待。有时你需要退后一步，以新的视角看待问题。你的牺牲不会白费，最终会获得回报。" },
  { name: "死神", number: 13, keywords: "结束、转变、新生", meaning: "死神牌代表着结束和转变。虽然结束可能让人害怕，但它也是新生的开始。放下过去，迎接新的篇章。" },
  { name: "节制", number: 14, keywords: "平衡、耐心、调节", meaning: "节制牌提醒你在生活中寻求平衡。现在是时候调整你的节奏，找到工作与休息的平衡点。保持耐心，美好的事物需要时间酝酿。" },
  { name: "恶魔", number: 15, keywords: "束缚、欲望、物质", meaning: "恶魔牌提醒你注意生活中的束缚和负面模式。你可能被物质欲望所困，或者被某种情况所束缚。认识并打破这些枷锁。" },
  { name: "塔", number: 16, keywords: "突变、解放、转变", meaning: "塔牌象征着突如其来的变化和觉醒。虽然可能让你感到震惊，但这些变化是必要的，它们将你从旧有的束缚中解放出来。" },
  { name: "星星", number: 17, keywords: "希望、灵感、疗愈", meaning: "星星牌代表着希望和灵感。在困难时期保持信念，星光指引你前进。你的创造力和直觉将带来疗愈和新的方向。" },
  { name: "月亮", number: 18, keywords: "直觉、幻觉、情绪", meaning: "月亮牌提醒你注意情绪和直觉。可能有不确定感或困惑，但这也是探索潜意识的好时机。跟随内心的光亮，不要被恐惧所困。" },
  { name: "太阳", number: 19, keywords: "成功、活力、喜悦", meaning: "太阳牌象征着成功和积极的能量。你正处于一个充满活力和喜悦的时期。享受生活，你的努力将得到回报。" },
  { name: "审判", number: 20, keywords: "觉醒、复活、评估", meaning: "审判牌提醒你评估过去的选择和行为。这是一个反思和自我评估的时刻。你准备好接受召唤，开始新的篇章了吗？" },
  { name: "世界", number: 21, keywords: "完成、成就、循环", meaning: "世界牌代表着一个周期的完成。你已经完成了一段旅程，现在是时候庆祝你的成就并准备迎接新的开始。闭环即是新的起点。" },
]

// 随机抽取一张牌
function drawCard() {
  const index = Math.floor(Math.random() * TAROT_CARDS.length)
  return TAROT_CARDS[index]
}

export default function TarotPage() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [card, setCard] = useState<typeof TAROT_CARDS[0] | null>(null)

  const handleDraw = async () => {
    setIsDrawing(true)
    
    // 模拟抽牌动画
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setCard(TAROT_CARDS[i % TAROT_CARDS.length])
    }
    
    const drawnCard = drawCard()
    setCard(drawnCard)
    setIsDrawing(false)
  }

  const handleReset = () => {
    setCard(null)
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/40 via-background to-background" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-2xl font-bold">塔罗牌</h1>
        </div>

        {!card ? (
          <Card className="max-w-xl mx-auto border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-rose-400" />
                塔罗占卜
              </CardTitle>
              <CardDescription>
                静下心来，抽取一张代表你当下状态的塔罗牌
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="text-8xl mb-4">🃏</div>
                <p className="text-muted-foreground">
                  集中精神，默念你的问题
                </p>
              </div>

              <Button 
                onClick={handleDraw}
                disabled={isDrawing}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 h-14 text-lg"
              >
                {isDrawing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    正在洗牌...
                  </>
                ) : (
                  <>
                    <Gem className="w-5 h-5 mr-2" />
                    抽取塔罗牌
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                每日可免费抽取3次
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm text-center overflow-hidden">
              <div className="bg-gradient-to-b from-rose-500/20 to-transparent pt-8 pb-4">
                <div className="text-8xl mb-4">🃏</div>
                <CardTitle className="font-serif text-3xl">{card.name}</CardTitle>
                <p className="text-rose-400 mt-2">第 {card.number} 号牌</p>
              </div>
              <CardContent className="border-t border-white/10">
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {card.keywords.split("、").map((keyword, idx) => (
                    <span key={idx} className="px-3 py-1 text-sm rounded-full bg-rose-500/20 text-rose-300">
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-400" />
                  牌义解读
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {card.meaning}
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                再抽一张
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
