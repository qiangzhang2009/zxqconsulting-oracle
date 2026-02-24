"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sentCode, setSentCode] = useState(false)

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      alert("请输入正确的手机号")
      return
    }
    // 演示模式：直接使用固定验证码
    setSentCode(true)
    setCode("123456")
    alert("演示模式：已自动填入验证码 123456")
  }

  const handleLogin = async () => {
    // 演示模式：任何验证码都可以登录
    if (!phone) {
      alert("请输入手机号")
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        phone,
        code: code || "123456", // 演示模式使用默认验证码
        redirect: false,
      })

      if (result?.error) {
        alert("登录失败：" + result.error)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      alert("登录出错")
    } finally {
      setIsLoading(false)
    }
  }

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
          <h1 className="font-serif text-2xl font-bold">命运方舟</h1>
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
                onChange={(e) => setPhone(e.target.value)}
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
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-white/10 border-white/10 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={sentCode}
                  className="whitespace-nowrap"
                >
                  {sentCode ? "已发送" : "获取验证码"}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isLoading ? (
                "登录中..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  登录
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              登录即表示同意我们的服务条款
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
