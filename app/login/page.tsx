"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, ArrowLeft, Send, User } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession()
  
  const [mounted, setMounted] = useState(false)
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sentCode, setSentCode] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 发送验证码
  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      alert("请输入正确的11位手机号")
      return
    }
    
    // 演示模式：直接使用固定验证码
    setSentCode(true)
    setCode("123456")
    alert("演示模式：已自动填入验证码 123456")
    
    // 倒计时
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 登录
  const handleLogin = async () => {
    if (!phone || phone.length !== 11) {
      alert("请输入手机号")
      return
    }

    setIsLoading(true)

    try {
      // 直接尝试登录，后端会自动创建新用户
      const result = await signIn("credentials", {
        phone,
        code: code || "123456",
        redirect: false,
      })

      console.log("登录结果:", result)

      if (result?.error) {
        alert("登录失败：" + result.error)
      } else {
        router.push("/profile")
        router.refresh()
      }
    } catch (error) {
      console.error("登录错误:", error)
      alert("登录出错，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  // 如果已登录，跳转到首页
  useEffect(() => {
    if (mounted && session?.user) {
      router.push("/")
    }
  }, [session, router, mounted])

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-background to-background" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex items-center justify-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="absolute left-4 top-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-2xl font-bold">知几</h1>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-serif text-2xl">登录 / 注册</CardTitle>
            <CardDescription>
              输入手机号快速登录
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">手机号</label>
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className="bg-white/10 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">验证码</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="请输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="bg-white/10 border-white/10 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={sentCode || countdown > 0}
                  className="whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}s` : (sentCode ? "已发送" : "获取验证码")}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || phone.length !== 11}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isLoading ? (
                "登录中..."
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  登录
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              演示模式：验证码填 123456 即可登录
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
