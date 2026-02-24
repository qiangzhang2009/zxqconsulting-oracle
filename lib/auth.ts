import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// 简化版认证：不依赖 Notion，使用内存存储
// 演示模式：任何手机号都可以直接登录

interface DemoUser {
  id: string
  phone: string
  name: string
  createdAt: number
}

// 内存存储演示用户
const demoUsers: Map<string, DemoUser> = new Map()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "手机号登录",
      credentials: {
        phone: { label: "手机号", type: "text", placeholder: "请输入手机号" },
        code: { label: "验证码", type: "text", placeholder: "请输入验证码" }
      },
      async authorize(credentials) {
        if (!credentials?.phone) {
          return null
        }

        const phone = credentials.phone.trim()
        
        // 查找或创建演示用户
        let user = demoUsers.get(phone)
        
        if (!user) {
          user = {
            id: 'user-' + Date.now(),
            phone: phone,
            name: `用户${phone.slice(-4)}`,
            createdAt: Date.now()
          }
          demoUsers.set(phone, user)
        }

        return {
          id: user.id,
          phone: user.phone,
          name: user.name,
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
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  }
}
