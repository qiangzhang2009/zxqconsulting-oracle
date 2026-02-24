import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByPhone, createUser } from "@/lib/notion"

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

        // 简化版：直接用手机号创建/查找用户
        // 实际生产需要验证码验证
        let user = await getUserByPhone(credentials.phone)

        if (!user) {
          // 创建新用户
          user = await createUser({
            phone: credentials.phone,
            name: `用户${credentials.phone.slice(-4)}`
          })
        }

        return {
          id: user.id,
          phone: credentials.phone,
          name: `用户${credentials.phone.slice(-4)}`,
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
