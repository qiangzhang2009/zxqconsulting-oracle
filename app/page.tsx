import Link from "next/link"
import { Sparkles, Star, Sun, Gem, ArrowRight, Sparkle } from "lucide-react"
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
    emoji: "🎴",
    feature: "人生格局",
  },
  {
    id: "constellation",
    title: "星座运势",
    description: "十二星座每日每周运势解读",
    icon: Star,
    href: "/constellation",
    color: "from-blue-500 to-cyan-500",
    emoji: "✨",
    feature: "每日运势",
  },
  {
    id: "zhouyi",
    title: "周易占卜",
    description: "易经六十四卦，预测吉凶祸福",
    icon: Sun,
    href: "/zhouyi",
    color: "from-amber-500 to-orange-500",
    emoji: "☯️",
    feature: "趋吉避凶",
  },
  {
    id: "tarot",
    title: "塔罗牌",
    description: "经典西方神秘学，解答人生困惑",
    icon: Gem,
    href: "/tarot",
    color: "from-rose-500 to-pink-500",
    emoji: "🃏",
    feature: "指引迷津",
  },
]

// 浮动装饰
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 浮动星星 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 3 + 3}s`,
          }}
        >
          <Sparkle 
            className="w-3 h-3 text-purple-400/30" 
            style={{ opacity: Math.random() * 0.5 + 0.2 }}
          />
        </div>
      ))}
      {/* 光晕 */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[120px]" />
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-indigo-950 to-background" />
      <FloatingElements />
      
      {/* 导航 */}
      <nav className="relative z-20 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkle className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-white">命运方舟</span>
          </div>
          <Link href="/login">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              登录
            </Button>
          </Link>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero区域 */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm mb-8 animate-fade-in-up">
            <Sparkle className="w-4 h-4 text-amber-400" />
            AI智能算命新时代
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              探索你的命运
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            结合千年传统命理学与先进AI技术，为您提供精准、个性化的命运解读
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/bazi">
              <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg rounded-full animate-pulse-glow">
                立即开始算命
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/constellation">
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10 text-lg rounded-full">
                测试星座运势
              </Button>
            </Link>
          </div>
        </div>

        {/* 算命类型卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {fortuneTypes.map((item, index) => (
            <Link key={item.id} href={item.href}>
              <Card className="group cursor-pointer border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl">{item.emoji}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="font-serif text-xl text-white mb-2">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-white/50">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-xs text-white/60">
                    <Sparkle className="w-3 h-3" />
                    {item.feature}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-8 mb-20 max-w-2xl mx-auto">
          {[
            { value: "50万+", label: "服务用户" },
            { value: "98%", label: "准确率" },
            { value: "4.9", label: "用户评分" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 特色功能 */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { emoji: "🎯", title: "精准分析", desc: "基于传统命理算法，结合现代AI技术，提供准确可靠的命理分析" },
            { emoji: "🤖", title: "AI智能解读", desc: "利用DeepSeek技术生成个性化、深入浅出的命理解读报告" },
            { emoji: "⚡", title: "快速出结果", desc: "秒级生成分析结果，随时随地，想算就算" },
          ].map((item, i) => (
            <div 
              key={i} 
              className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-amber-600/20 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">准备好探索你的命运了吗？</h2>
            <p className="text-white/60 mb-6">每日免费算命3次 · 首次注册赠送VIP体验</p>
            <Link href="/bazi">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-6 text-lg rounded-full">
                开始探索
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkle className="w-4 h-4 text-purple-400" />
            <span className="text-white/70">命运方舟</span>
          </div>
          <p className="text-white/40 text-sm">© 2024 命运方舟 Fortune Insight. All rights reserved.</p>
          <p className="text-white/30 text-xs mt-2">本服务仅供娱乐参考，请勿迷信</p>
        </div>
      </footer>
    </div>
  )
}
