import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || null

    const body = await request.json()
    const { 
      question,
      hexagramName,
      hexagramSymbol,
      meaning,
      description,
      interpretation,
      readingType,
      coinsTosses
    } = body

    if (!question || !hexagramName) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 简单的卦象编号计算（简化版）
    const hexagramMap: Record<string, number> = {
      "乾卦": 1, "坤卦": 2, "屯卦": 3, "蒙卦": 4, "需卦": 5,
      "讼卦": 6, "师卦": 7, "比卦": 8, "小畜卦": 9, "履卦": 10
    }
    const hexagramNumber = hexagramMap[hexagramName] || Math.floor(Math.random() * 64) + 1

    const record = await prisma.zhouyiReading.create({
      data: {
        userId,
        question,
        coinsTosses: coinsTosses || [],
        hexagramNumber,
        hexagramName,
        hexagramSymbol,
        guaCi: description,
        xiangZheng: interpretation,
        aiInterpretation: interpretation
      }
    })

    return NextResponse.json({ 
      success: true, 
      recordId: record.id,
      message: '周易记录已保存'
    })
  } catch (error) {
    console.error('保存周易记录错误:', error)
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const records = await prisma.zhouyiReading.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    return NextResponse.json({ records })
  } catch (error) {
    console.error('获取周易记录错误:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}
