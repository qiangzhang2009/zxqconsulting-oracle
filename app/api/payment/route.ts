import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// 会员套餐配置
const MEMBERSHIP_PLANS = {
  MONTHLY: {
    id: 'monthly',
    name: '月卡会员',
    price: 2900, // 分
    duration: 30, // 天
    features: [
      '无限次算命',
      'AI详细解读',
      '每日运势推送',
      '历史记录保存',
      '专属客服支持'
    ]
  },
  YEARLY: {
    id: 'yearly',
    name: '年卡会员',
    price: 19900, // 分
    duration: 365, // 天
    features: [
      '无限次算命',
      'AI详细解读',
      '每日运势推送',
      '历史记录保存',
      '专属客服支持',
      '高级命理课程',
      '优先体验新功能'
    ],
    popular: true
  },
  LIFETIME: {
    id: 'lifetime',
    name: '终身VIP',
    price: 69900, // 分
    duration: 365 * 100, // 100年
    features: [
      '无限次算命',
      'AI详细解读',
      '每日运势推送',
      '历史记录保存',
      '专属客服支持',
      '高级命理课程',
      '优先体验新功能',
      '一对一命理师咨询',
      '线下活动邀请'
    ]
  }
}

// 单次付费套餐
const SINGLE_PLANS = {
  BAZI_DETAIL: {
    id: 'bazi_detail',
    name: '八字详细解读',
    price: 990, // 分
    features: [
      '完整八字排盘',
      '五行分析',
      '事业财运详解',
      '婚姻感情分析',
      '健康建议',
      '流年大运预测'
    ]
  },
  ZHOUYI_DETAIL: {
    id: 'zhouyi_detail',
    name: '周易详细解卦',
    price: 1990, // 分
    features: [
      '完整卦象解读',
      '时运判断',
      '具体问题指导',
      '行动建议',
      '趋吉避凶方法'
    ]
  },
  TAROT_DETAIL: {
    id: 'tarot_detail',
    name: '塔罗深度解读',
    price: 2990, // 分
    features: [
      '牌面能量分析',
      '现状深度解读',
      '问题核心提示',
      '未来发展建议',
      '行动指引'
    ]
  }
}

// 获取会员套餐列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  if (type === 'single') {
    return NextResponse.json({ plans: SINGLE_PLANS })
  }

  return NextResponse.json({ plans: MEMBERSHIP_PLANS })
}

// 创建支付订单
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, planId, planType } = body

    if (!userId || !planId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 获取套餐信息
    const plans = planType === 'single' ? SINGLE_PLANS : MEMBERSHIP_PLANS
    const plan = plans[planId as keyof typeof plans]

    if (!plan) {
      return NextResponse.json({ error: '无效的套餐ID' }, { status: 400 })
    }

    // 创建订单（简化版，实际需要调用支付接口）
    const order = await prisma.order.create({
      data: {
        userId,
        type: planType === 'single' ? 'SINGLE' : 
              planId === 'MONTHLY' ? 'MONTHLY' :
              planId === 'YEARLY' ? 'YEARLY' : 'LIFETIME',
        amount: plan.price,
        status: 'PENDING'
      }
    })

    // 返回支付信息（简化版）
    // 实际生产需要调用微信/支付宝SDK生成支付参数
    return NextResponse.json({
      orderId: order.id,
      amount: plan.price,
      planName: plan.name,
      // 模拟支付链接
      paymentUrl: `/payment/simulate?orderId=${order.id}`,
      message: '支付功能演示模式'
    })

  } catch (error) {
    console.error('创建订单错误:', error)
    return NextResponse.json({ error: '创建订单失败' }, { status: 500 })
  }
}
