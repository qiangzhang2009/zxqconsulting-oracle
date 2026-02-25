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
      birthDate,
      birthTime,
      birthLocation,
      yearGan,
      yearZhi,
      monthGan,
      monthZhi,
      dayGan,
      dayZhi,
      hourGan,
      hourZhi,
      aiAnalysis,
      simpleAnalysis
    } = body

    if (!birthDate || !dayGan || !dayZhi) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 构建出生日期时间
    const birthHour = parseInt(birthTime || '12', 10)
    const birthDatetime = new Date(`${birthDate}T${String(birthHour).padStart(2, '0')}:00:00`)

    // 构建八字柱
    const yearPillar = yearGan + yearZhi
    const monthPillar = monthGan + monthZhi
    const dayPillar = dayGan + dayZhi
    const hourPillar = hourGan + hourZhi

    // 简单的日主五行计算（简化版）
    const dayMasterElements: Record<string, string> = {
      "甲": "木", "乙": "木", "丙": "火", "丁": "火",
      "戊": "土", "己": "土", "庚": "金", "辛": "金",
      "壬": "水", "癸": "水"
    }
    const sunElement = dayMasterElements[dayGan] || "土"

    const record = await prisma.baziRecord.create({
      data: {
        userId,
        birthDatetime,
        birthLocation,
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar,
        dayMaster: dayGan,
        sunElement,
        tenGods: {},
        aiAnalysis,
        simpleAnalysis,
        readingType: 'natal',
        source: 'free'
      }
    })

    return NextResponse.json({ 
      success: true, 
      recordId: record.id,
      message: '八字记录已保存'
    })
  } catch (error) {
    console.error('保存八字记录错误:', error)
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
    const records = await prisma.baziRecord.findMany({
      where: currentUserId ? { userId: currentUserId } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    return NextResponse.json({ records })
  } catch (error) {
    console.error('获取八字记录错误:', error)
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

    const record = await prisma.baziRecord.findUnique({
      where: { id: recordId }
    })

    if (!record) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }

    if (record.userId && record.userId !== currentUserId) {
      return NextResponse.json({ error: '无权删除此记录' }, { status: 403 })
    }

    await prisma.baziRecord.delete({
      where: { id: recordId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除记录错误:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
