import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "手机号登录",
      credentials: {
        phone: { label: "手机号", type: "text", placeholder: "请输入手机号" },
        code: { label: "验证码", type: "text", placeholder: "请输入验证码（测试期任意）" }
      },
      async authorize(credentials) {
        if (!credentials?.phone) {
          return null
        }

        const phone = credentials.phone.trim()
        
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
                nickname: `用户${phone.slice(-4)}`,
                email: `${phone}@zhiiji.com` // 虚拟邮箱
              }
            })
            console.log('新用户注册:', user.id, phone)
          }

          return {
            id: user.id,
            phone: user.phone,
            name: user.nickname || `用户${phone.slice(-4)}`,
          }
        } catch (error) {
          console.error('用户认证错误:', error)
          return null
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
