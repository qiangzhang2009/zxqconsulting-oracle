import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get("phone")

  if (!phone) {
    return NextResponse.json({ exists: false, error: "手机号不能为空" })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { phone },
      select: { id: true }
    })

    return NextResponse.json({ exists: !!user })
  } catch (error) {
    console.error("检查用户错误:", error)
    return NextResponse.json({ exists: false, error: "服务器错误" })
  }
}
