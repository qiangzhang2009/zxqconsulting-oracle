import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

export const authOptions: NextAuthOptions = {
  providers: [
    // 手机号登录
    CredentialsProvider({
      name: "手机号登录",
      credentials: {
        phone: { label: "手机号", type: "text", placeholder: "请输入手机号" },
        code: { label: "验证码", type: "text", placeholder: "请输入验证码" },
        nickname: { label: "昵称", type: "text", required: false },
        avatar: { label: "头像", type: "text", required: false }
      },
      async authorize(credentials) {
        console.log('登录尝试:', credentials?.phone)
        
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
          
          console.log('查找用户结果:', user ? '找到' : '未找到')
          
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
            console.log('新用户创建成功:', user.id)
          }

          return {
            id: user.id,
            phone: user.phone || '',
            name: user.nickname || `用户${phone.slice(-4)}`,
            image: user.avatarUrl || "🌟",
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
      console.log('jwt callback:', user?.id)
      if (user) {
        token.id = user.id
        token.avatar = (user as any).image
      }
      return token
    },
    async session({ session, token }) {
      console.log('session callback:', token.id)
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
  },
  debug: true,
}
