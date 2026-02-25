import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // 获取当前用户（可选，支持游客）
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || null

    const body = await request.json()
    const { 
      birthDate, 
      birthTime, 
      birthLocation,
      sunSign, 
      moonSign, 
      risingSign,
      planetPositions,
      houseSigns,
      aspects,
      elements,
      modes,
      aiAnalysis,
      simpleAnalysis,
      isFavorite,
      readingType,
      source
    } = body

    if (!birthDate || !sunSign) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 保存到数据库
    const record = await prisma.constellationRecord.create({
      data: {
        userId,
        birthDate: new Date(birthDate),
        birthTime: birthTime ? new Date(birthTime) : null,
        birthLocation,
        sunSign,
        moonSign,
        risingSign,
        planetPositions: planetPositions || {},
        houseSigns,
        aspects,
        elements,
        modes,
        aiAnalysis,
        simpleAnalysis,
        isFavorite: isFavorite || false,
        readingType: readingType || 'natal',
        source: source || 'free'
      }
    })

    return NextResponse.json({ 
      success: true, 
      recordId: record.id,
      message: '星座记录已保存'
    })
  } catch (error) {
    console.error('保存星座记录错误:', error)
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}

// 获取用户的星座记录
export async function GET(request: Request) {
  try {
    // 从 session 获取当前用户
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 只返回当前登录用户的记录
    const records = await prisma.constellationRecord.findMany({
      where: currentUserId ? { userId: currentUserId } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.constellationRecord.count({
      where: currentUserId ? { userId: currentUserId } : {}
    })

    return NextResponse.json({ records, total })
  } catch (error) {
    console.error('获取星座记录错误:', error)
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

    // 验证记录属于当前用户
    const record = await prisma.constellationRecord.findUnique({
      where: { id: recordId }
    })

    if (!record) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }

    // 如果不是游客记录，验证所有权
    if (record.userId && record.userId !== currentUserId) {
      return NextResponse.json({ error: '无权删除此记录' }, { status: 403 })
    }

    await prisma.constellationRecord.delete({
      where: { id: recordId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除记录错误:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}
