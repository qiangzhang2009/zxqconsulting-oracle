import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// 演示模式：用内存存储用户
const demoUsers: Record<string, { id: string; phone: string; nickname: string; avatar: string }> = {}

export const authOptions: NextAuthOptions = {
  providers: [
    // 手机号登录（演示模式 - 不依赖数据库）
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
        
        // 演示模式：直接用内存存储
        if (!demoUsers[phone]) {
          demoUsers[phone] = {
            id: `demo_${Date.now()}`,
            phone,
            nickname: nickname || `用户${phone.slice(-4)}`,
            avatar: avatar || "🌟"
          }
          console.log('新用户注册(演示模式):', phone, nickname)
        }

        return {
          id: demoUsers[phone].id,
          phone: demoUsers[phone].phone,
          name: demoUsers[phone].nickname,
          avatar: demoUsers[phone].avatar,
        }
      }
    })
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
