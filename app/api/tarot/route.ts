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
      cardName, 
      cardNumber,
      keywords,
      meaning,
      readingType,
      question,
      aiAnalysis
    } = body

    if (!cardName || cardNumber === undefined) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 将单张牌转换为 drawnCards 格式
    const drawnCards = [{
      name: cardName,
      number: cardNumber,
      keywords: keywords,
      meaning: meaning
    }]

    const record = await prisma.tarotReading.create({
      data: {
        userId,
        question,
        readingType: readingType || 'general',
        spreadType: 'single',
        drawnCards,
        aiInterpretation: aiAnalysis
      }
    })

    return NextResponse.json({ 
      success: true, 
      recordId: record.id,
      message: '塔罗牌记录已保存'
    })
  } catch (error) {
    console.error('保存塔罗牌记录错误:', error)
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const records = await prisma.tarotReading.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    return NextResponse.json({ records })
  } catch (error) {
    console.error('获取塔罗牌记录错误:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}
