import Link from "next/link"
import { Sparkles, Star, Sun, Gem } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const fortuneTypes = [
  {
    id: "bazi",
    title: "八字算命",
    description: "根据出生年月日时，解析命运格局",
    icon: Sparkles,
    href: "/bazi",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "constellation",
    title: "星座运势",
    description: "十二星座每日每周运势解读",
    icon: Star,
    href: "/constellation",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "zhouyi",
    title: "周易占卜",
    description: "易经六十四卦，预测吉凶祸福",
    icon: Sun,
    href: "/zhouyi",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "tarot",
    title: "塔罗牌",
    description: "经典西方神秘学，解答人生困惑",
    icon: Gem,
    href: "/tarot",
    color: "from-rose-500 to-pink-500",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-background to-background" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 头部 */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-gold-400 to-purple-400 bg-clip-text text-transparent">
            命运方舟
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Fortune Insight · AI智能算命
          </p>
          <p className="max-w-2xl mx-auto text-muted-foreground/80">
            结合千年传统命理学与先进AI技术，为您提供精准、个性化的命运解读
          </p>
        </div>

        {/* 算命类型卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {fortuneTypes.map((item, index) => (
            <Link key={item.id} href={item.href}>
              <Card className="group cursor-pointer border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="font-serif text-xl text-white">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* 特色功能 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">精准分析</h3>
            <p className="text-muted-foreground text-sm">
              基于传统命理算法，结合现代AI技术，提供准确可靠的命理分析
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI智能解读</h3>
            <p className="text-muted-foreground text-sm">
              利用GPT技术生成个性化、深入浅出的命理解读报告
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-semibold mb-2">随时随地</h3>
            <p className="text-muted-foreground text-sm">
              网页版随时可用，支持微信登录，数据云端同步
            </p>
          </div>
        </div>

        {/* CTA按钮 */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-full animate-pulse-glow">
            开始算命
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            每日免费算命3次 · 首次注册赠送VIP体验
          </p>
        </div>
      </div>

      {/* 底部 */}
      <footer className="relative z-10 border-t border-white/10 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 命运方舟 Fortune Insight. All rights reserved.</p>
          <p className="mt-2">本服务仅供娱乐参考，请勿迷信</p>
        </div>
      </footer>
    </div>
  )
}
