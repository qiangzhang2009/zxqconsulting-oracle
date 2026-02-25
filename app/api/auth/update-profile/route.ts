import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 })
  }

  try {
    const { nickname, avatar } = await request.json()

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nickname: nickname || undefined,
        avatarUrl: avatar || undefined
      }
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("更新用户资料错误:", error)
    return NextResponse.json({ error: "更新失败" }, { status: 500 })
  }
}
