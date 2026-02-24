"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Crown, Zap, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

const MEMBERSHIP_PLANS = [
  {
    id: "monthly",
    name: "月卡会员",
    price: 29,
    duration: "30天",
    icon: Sparkles,
    color: "from-purple-500 to-indigo-500",
    features: [
      "无限次算命",
      "AI详细解读",
      "每日运势推送",
      "历史记录保存",
      "专属客服支持"
    ]
  },
  {
    id: "yearly",
    name: "年卡会员",
    price: 199,
    duration: "365天",
    icon: Crown,
    color: "from-gold-500 to-amber-500",
    popular: true,
    features: [
      "无限次算命",
      "AI详细解读",
      "每日运势推送",
      "历史记录保存",
      "专属客服支持",
      "高级命理课程",
      "优先体验新功能"
    ]
  },
  {
    id: "lifetime",
    name: "终身VIP",
    price: 699,
    duration: "终身",
    icon: Zap,
    color: "from-rose-500 to-pink-500",
    features: [
      "无限次算命",
      "AI详细解读",
      "每日运势推送",
      "历史记录保存",
      "专属客服支持",
      "高级命理课程",
      "优先体验新功能",
      "一对一命理师咨询",
      "线下活动邀请"
    ]
  }
]

const SINGLE_PLANS = [
  {
    id: "bazi_detail",
    name: "八字详细解读",
    price: 9.9,
    features: [
      "完整八字排盘",
      "五行分析",
      "事业财运详解",
      "婚姻感情分析",
      "健康建议",
      "流年大运预测"
    ]
  },
  {
    id: "zhouyi_detail",
    name: "周易详细解卦",
    price: 19.9,
    features: [
      "完整卦象解读",
      "时运判断",
      "具体问题指导",
      "行动建议",
      "趋吉避凶方法"
    ]
  },
  {
    id: "tarot_detail",
    name: "塔罗深度解读",
    price: 29.9,
    features: [
      "牌面能量分析",
      "现状深度解读",
      "问题核心提示",
      "未来发展建议",
      "行动指引"
    ]
  }
]

export default function VipPage() {
  const [activeTab, setActiveTab] = useState<"membership" | "single">("membership")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async (planId: string) => {
    setSelectedPlan(planId)
    setIsLoading(true)

    // 模拟支付流程
    await new Promise(resolve => setTimeout(resolve, 1500))

    alert("支付功能演示模式 - 实际开发需要集成微信/支付宝SDK")
    setIsLoading(false)
    setSelectedPlan(null)
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-background to-background" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-2xl font-bold">开通会员</h1>
        </div>

        {/* 标签切换 */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={activeTab === "membership" ? "default" : "outline"}
            onClick={() => setActiveTab("membership")}
            className={activeTab === "membership" ? "bg-purple-600" : ""}
          >
            会员订阅
          </Button>
          <Button
            variant={activeTab === "single" ? "default" : "outline"}
            onClick={() => setActiveTab("single")}
            className={activeTab === "single" ? "bg-purple-600" : ""}
          >
            单次购买
          </Button>
        </div>

        {activeTab === "membership" ? (
          // 会员订阅
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {MEMBERSHIP_PLANS.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative border-white/10 bg-white/5 backdrop-blur-sm hover:border-purple-500/50 transition-all ${
                  plan.popular ? "ring-2 ring-gold-500/50" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-gold-500 to-amber-500 rounded-full text-sm font-medium">
                    最受欢迎
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="font-serif text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">¥{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.duration === '终身' ? '次' : '年'}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
                  >
                    {isLoading && selectedPlan === plan.id ? (
                      "处理中..."
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        立即开通
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // 单次购买
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {SINGLE_PLANS.map((plan) => (
              <Card key={plan.id} className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="font-serif text-xl">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold">¥{plan.price}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  >
                    {isLoading && selectedPlan === plan.id ? (
                      "处理中..."
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        立即购买
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 支付说明 */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>支付说明</p>
          <p className="mt-2">我们支持微信支付、支付宝等主流支付方式</p>
          <p className="mt-1">支付过程中有任何问题请联系客服</p>
        </div>
      </div>
    </div>
  )
}
