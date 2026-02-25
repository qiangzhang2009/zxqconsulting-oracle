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
    // 从 session 获取当前用户
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 只返回当前登录用户的记录
    const records = await prisma.zhouyiReading.findMany({
      where: currentUserId ? { userId: currentUserId } : {},
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

    const record = await prisma.zhouyiReading.findUnique({
      where: { id: recordId }
    })

    if (!record) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }

    if (record.userId && record.userId !== currentUserId) {
      return NextResponse.json({ error: '无权删除此记录' }, { status: 403 })
    }

    await prisma.zhouyiReading.delete({
      where: { id: recordId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除记录错误:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
