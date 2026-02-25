import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    // 手机号登录（演示模式）
    CredentialsProvider({
      name: "手机号登录",
      credentials: {
        phone: { label: "手机号", type: "text", placeholder: "请输入手机号" },
        code: { label: "验证码", type: "text", placeholder: "请输入验证码（测试期任意）" },
        nickname: { label: "昵称", type: "text", required: false },
        avatar: { label: "头像", type: "text", required: false }
      },
      async authorize(credentials) {
        if (!credentials?.phone) {
          return null
        }

        const phone = credentials.phone.trim()
        const nickname = credentials.nickname?.trim()
        const avatar = credentials.avatar
        
        try {
          // 查找用户
          let user = await prisma.user.findUnique({
            where: { phone }
          })
          
          // 如果用户不存在，自动创建
          if (!user) {
            user = await prisma.user.create({
              data: {
                phone,
                nickname: nickname || `用户${phone.slice(-4)}`,
                email: `${phone}@zhiiji.com`,
                avatarUrl: avatar || "🌟"
              }
            })
            console.log('新用户注册:', user.id, phone, nickname)
          }

          return {
            id: user.id,
            phone: user.phone,
            name: user.nickname || `用户${phone.slice(-4)}`,
            avatar: user.avatarUrl || "🌟",
          }
        } catch (error) {
          console.error('用户认证错误:', error)
          return null
        }
      }
    })
    // 微信登录（需要企业认证的公众号/小程序）
    // 如果需要启用微信登录，需要在 .env.local 中配置以下环境变量：
    // WECHAT_APP_ID=your_app_id
    // WECHAT_APP_SECRET=your_app_secret
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.avatar = (user as any).avatar
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        (session.user as any).avatar = token.avatar || "🌟"
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  }
}
