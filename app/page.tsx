"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Sparkles, Star, Sun, Gem, ArrowRight, Sparkle, Heart, Briefcase, Compass, Moon, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

// 场景化入口 - 按文档规划
const sceneEntries = [
  {
    id: "self",
    title: "自我探索",
    description: "我是谁？我的天赋与性格特质是什么？",
    icon: Compass,
    href: "/constellation",
    color: "from-blue-500 to-cyan-400",
    emoji: "🔮",
    cta: "探索星盘",
  },
  {
    id: "love",
    title: "情感关系",
    description: "我的情感模式是什么？如何与TA相处？",
    icon: Heart,
    href: "/match",
    color: "from-rose-500 to-pink-400",
    emoji: "💕",
    cta: "情感解惑",
  },
  {
    id: "career",
    title: "事业财富",
    description: "我的事业方向在哪里？如何把握机遇？",
    icon: Briefcase,
    href: "/bazi",
    color: "from-amber-500 to-orange-400",
    emoji: "💼",
    cta: "事业指引",
  },
]

// 工具模块（场景化入口的下层）
const tools = [
  {
    id: "constellation",
    title: "星座星盘",
    description: "太阳、月亮、上升星座，解读你的核心特质",
    icon: Star,
    href: "/constellation",
    color: "from-blue-500 to-cyan-500",
    emoji: "✨",
    camp: "west",
  },
  {
    id: "match",
    title: "星座配对",
    description: "两人星座合盘，了解相处模式",
    icon: Heart,
    href: "/match",
    color: "from-rose-500 to-pink-500",
    emoji: "💑",
    camp: "west",
  },
  {
    id: "tarot",
    title: "塔罗牌阵",
    description: "聚焦当下问题，揭示潜意识指引",
    icon: Gem,
    href: "/tarot",
    color: "from-violet-500 to-purple-500",
    emoji: "🃏",
    camp: "west",
  },
  {
    id: "bazi",
    title: "八字命理",
    description: "出生时间格局，解读人生大运",
    icon: Sparkles,
    href: "/bazi",
    color: "from-amber-600 to-orange-600",
    emoji: "🎴",
    camp: "east",
  },
  {
    id: "zhouyi",
    title: "周易占卜",
    description: "易经六十四卦，决策参考指南",
    icon: Sun,
    href: "/zhouyi",
    color: "from-yellow-600 to-amber-600",
    emoji: "☯️",
    camp: "east",
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
  const { data: session } = useSession()
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
              <Moon className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-white">知几</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/constellation" className="text-white/70 hover:text-white text-sm hidden sm:block">
              自我探索
            </Link>
            <Link href="/match" className="text-white/70 hover:text-white text-sm hidden sm:block">
              情感关系
            </Link>
            <Link href="/bazi" className="text-white/70 hover:text-white text-sm hidden sm:block">
              事业财富
            </Link>
            {session ? (
              <Link href="/profile">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <User className="w-4 h-4 mr-1" />
                  我的
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  登录
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero区域 */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm mb-8 animate-fade-in-up">
            <Sparkle className="w-4 h-4 text-amber-400" />
            东西方智慧决策平台
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              知几知彼
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            用东方智慧看八字周易，用西方心理学解星座塔罗<br/>
            <span className="text-white/50 text-lg">无论你是想了解自己，还是想做出人生决策，这里都有答案</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/constellation">
              <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg rounded-full animate-pulse-glow">
                开始探索
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 场景化入口 - 核心区域 */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            你今天想了解什么？
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {sceneEntries.map((scene, index) => (
              <Link key={scene.id} href={scene.href}>
                <Card className="group cursor-pointer border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scene.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <span className="text-3xl">{scene.emoji}</span>
                      </div>
                      <ArrowRight className="w-6 h-6 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle className="font-serif text-2xl text-white mb-2">
                      {scene.title}
                    </CardTitle>
                    <CardDescription className="text-white/60 text-base">
                      {scene.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white group-hover:bg-white/20 transition-colors">
                      <span className="text-sm font-medium">{scene.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 工具模块 - 分类展示 */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1 max-w-[100px]" />
            <span className="text-white/40 text-sm">或选择具体工具</span>
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1 max-w-[100px]" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {tools.map((tool, index) => (
              <Link key={tool.id} href={tool.href}>
                <Card className={`group cursor-pointer border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 h-full ${tool.camp === 'east' ? 'hover:border-amber-500/50 hover:shadow-amber-500/20' : 'hover:border-purple-500/50 hover:shadow-purple-500/20'}`}>
                  <CardHeader className="pb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-xl">{tool.emoji}</span>
                    </div>
                    <CardTitle className="font-serif text-lg text-white">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/50 text-xs line-clamp-2">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 特色功能 */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { emoji: "🎯", title: "更懂自己", desc: "不是给你贴标签，而是帮助你理解自己的内在模式" },
            { emoji: "🤝", title: "关系解密", desc: "了解自己在关系中的模式，学会更好的相处之道" },
            { emoji: "✨", title: "成长指引", desc: "不是告诉你会发生什么，而是启发你如何变得更好" },
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
            <h2 className="text-2xl font-bold text-white mb-4">准备好更了解自己了吗？</h2>
            <p className="text-white/60 mb-6">输入你的出生信息，获得专属的人生指引</p>
            <Link href="/constellation">
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
            <Moon className="w-4 h-4 text-purple-400" />
            <span className="text-white/70">知几</span>
          </div>
          <p className="text-white/40 text-sm">© 2024 知几. All rights reserved.</p>
          <p className="text-white/30 text-xs mt-2">本服务仅供娱乐参考，请勿迷信</p>
        </div>
      </footer>

      {/* 移动端底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/10 px-6 py-3 safe-area-pb md:hidden z-50">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center gap-1 text-purple-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-medium">首页</span>
          </Link>
          <Link href="/constellation" className="flex flex-col items-center gap-1 text-white/60">
            <Compass className="w-5 h-5" />
            <span className="text-xs">探索</span>
          </Link>
          <Link href="/match" className="flex flex-col items-center gap-1 text-white/60">
            <Heart className="w-5 h-5" />
            <span className="text-xs">配对</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-white/60">
            <User className="w-5 h-5" />
            <span className="text-xs">我的</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
