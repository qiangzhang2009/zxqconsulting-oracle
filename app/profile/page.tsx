"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  User, 
  Sparkles, 
  LogOut, 
  Settings, 
  Heart,
  Star,
  Gem,
  Sun,
  ArrowRight,
  Loader2,
  Calendar,
  Trash2
} from "lucide-react"

// 记录类型定义
interface RecordItem {
  id: string
  createdAt: string
  title: string
  type: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'constellation' | 'match' | 'tarot' | 'bazi' | 'zhouyi'>('constellation')
  const [records, setRecords] = useState<RecordItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 加载用户记录
  useEffect(() => {
    if (status === 'authenticated') {
      loadRecords()
    }
  }, [activeTab, status])

  const loadRecords = async () => {
    setIsLoading(true)
    try {
      let endpoint = ''
      switch (activeTab) {
        case 'constellation':
          endpoint = '/api/constellation'
          break
        case 'match':
          endpoint = '/api/match'
          break
        case 'tarot':
          endpoint = '/api/tarot'
          break
        case 'bazi':
          endpoint = '/api/bazi'
          break
        case 'zhouyi':
          endpoint = '/api/zhouyi'
          break
      }

      const res = await fetch(`${endpoint}?limit=20`)
      const data = await res.json()
      
      // 格式化记录
      const formattedRecords: RecordItem[] = (data.records || []).map((record: any) => ({
        id: record.id,
        createdAt: new Date(record.createdAt).toLocaleDateString('zh-CN'),
        title: getRecordTitle(record, activeTab),
        type: activeTab
      }))
      
      setRecords(formattedRecords)
    } catch (error) {
      console.error('加载记录失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRecordTitle = (record: any, type: string): string => {
    switch (type) {
      case 'constellation':
        return record.sunSign || '星座解析'
      case 'match':
        return `${record.myConstellation} + ${record.theirConstellation}`
      case 'tarot':
        return record.cardName || '塔罗牌'
      case 'bazi':
        return record.dayPillar ? `${record.dayPillar.slice(0,2)}日主` : '八字命理'
      case 'zhouyi':
        return record.hexagramName || '周易卦象'
      default:
        return '记录'
    }
  }

  const tabs = [
    { key: 'constellation', label: '星座', icon: Star },
    { key: 'match', label: '配对', icon: Heart },
    { key: 'tarot', label: '塔罗', icon: Gem },
    { key: 'bazi', label: '八字', icon: User },
    { key: 'zhouyi', label: '周易', icon: Sun },
  ] as const

  // 未登录状态
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-rose-50/30 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center pt-20">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-violet-300 to-rose-300 flex items-center justify-center mb-6">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-800 mb-4">登录后查看你的记录</h1>
            <p className="text-stone-500 mb-8">登录后，你可以保存和查看所有的占卜记录</p>
            <Link href="/login">
              <Button className="w-full h-12 bg-gradient-to-r from-violet-400 to-rose-400 text-white rounded-xl">
                立即登录
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 加载中
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-rose-50/30 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-rose-50/30 to-white">
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* 用户信息头部 */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-lg shadow-stone-200/50 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-violet-400 via-rose-400 to-amber-400" />
            <CardContent className="relative pt-0 pb-6">
              <div className="flex items-end justify-between -mt-12 mb-4">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
                  <User className="w-12 h-12 text-violet-400" />
                </div>
                <div className="flex gap-2">
                  <ThemeToggle />
                  <Link href="/vip">
                    <Button variant="outline" size="sm" className="text-amber-500 border-amber-300 hover:bg-amber-50">
                      <Sparkles className="w-4 h-4 mr-1" />
                      VIP
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-stone-500"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-800">
                  {session?.user?.name || '用户'}
                </h2>
                <p className="text-stone-500 text-sm">
                  {session?.user?.email || '探索者'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 统计信息 */}
        <div className="max-w-2xl mx-auto mb-6 grid grid-cols-3 gap-4">
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-violet-500">{records.length || 0}</div>
              <div className="text-xs text-stone-500">记录数</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-rose-500">
                {records.length > 0 ? '🌟' : '-'}
              </div>
              <div className="text-xs text-stone-500">收藏</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">VIP</div>
              <div className="text-xs text-stone-500">会员</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab 切换 */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-violet-400 text-white shadow-md'
                    : 'bg-white/60 text-stone-600 hover:bg-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 记录列表 */}
        <div className="max-w-2xl mx-auto space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            </div>
          ) : records.length === 0 ? (
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500">暂无记录</p>
                <Link href={activeTab === 'constellation' ? '/constellation' : `/${activeTab}`}>
                  <Button variant="outline" className="mt-4">
                    去探索
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            records.map((record) => (
              <Card key={record.id} className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activeTab === 'constellation' ? 'bg-violet-100' :
                      activeTab === 'match' ? 'bg-rose-100' :
                      activeTab === 'tarot' ? 'bg-amber-100' :
                      activeTab === 'bazi' ? 'bg-stone-100' : 'bg-orange-100'
                    }`}>
                      {activeTab === 'constellation' && <Star className="w-5 h-5 text-violet-500" />}
                      {activeTab === 'match' && <Heart className="w-5 h-5 text-rose-500" />}
                      {activeTab === 'tarot' && <Gem className="w-5 h-5 text-amber-500" />}
                      {activeTab === 'bazi' && <User className="w-5 h-5 text-stone-500" />}
                      {activeTab === 'zhouyi' && <Sun className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-stone-800">{record.title}</p>
                      <p className="text-xs text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {record.createdAt}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-stone-400 hover:text-stone-600">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* 快捷入口 */}
        <div className="max-w-2xl mx-auto mt-8">
          <h3 className="font-medium text-stone-700 mb-4">快捷入口</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/constellation">
              <Card className="border-0 bg-white/60 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Star className="w-5 h-5 text-violet-400" />
                  <span className="text-stone-700">星座解析</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/match">
              <Card className="border-0 bg-white/60 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <span className="text-stone-700">星座配对</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tarot">
              <Card className="border-0 bg-white/60 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Gem className="w-5 h-5 text-amber-400" />
                  <span className="text-stone-700">塔罗牌</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/bazi">
              <Card className="border-0 bg-white/60 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <User className="w-5 h-5 text-stone-500" />
                  <span className="text-stone-700">八字命理</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-stone-200 px-6 py-3 safe-area-pb">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center gap-1 text-stone-400">
            <Star className="w-5 h-5" />
            <span className="text-xs">首页</span>
          </Link>
          <Link href="/constellation" className="flex flex-col items-center gap-1 text-stone-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs">探索</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-violet-500">
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">我的</span>
          </div>
        </div>
      </div>
    </div>
  )
}
