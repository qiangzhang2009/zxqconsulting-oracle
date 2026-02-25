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
    // 从 session 获取当前用户
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 只返回当前登录用户的记录
    const records = await prisma.tarotReading.findMany({
      where: currentUserId ? { userId: currentUserId } : {},
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

// 删除记录
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id
    
    const { searchParams } = new URL(request.url)
    const recordId = searchParams.get('id')

    if (!recordId) {
      return NextResponse.json({ error: '缺少记录ID' }, { status: 400 })
    }

    const record = await prisma.tarotReading.findUnique({
      where: { id: recordId }
    })

    if (!record) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }

    if (record.userId && record.userId !== currentUserId) {
      return NextResponse.json({ error: '无权删除此记录' }, { status: 403 })
    }

    await prisma.tarotReading.delete({
      where: { id: recordId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除记录错误:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
