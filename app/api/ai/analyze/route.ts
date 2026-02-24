import { NextResponse } from 'next/server'
import { generateAnalysis, FortuneData } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, input, result } = body

    if (!type || !result) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    const data: FortuneData = {
      type,
      input: input || {},
      result
    }

    const analysis = await generateAnalysis(data)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('AI分析错误:', error)
    return NextResponse.json({ error: '分析生成失败' }, { status: 500 })
  }
}
