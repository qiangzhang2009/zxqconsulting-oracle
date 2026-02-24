import { NextResponse } from 'next/server'

// 运势分析结果缓存
const fortuneCache = new Map<string, { data: any; timestamp: number }>()

// 运势API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const userId = searchParams.get('userId')

  if (!type) {
    return NextResponse.json({ error: '缺少type参数' }, { status: 400 })
  }

  // 检查缓存
  const cacheKey = `${type}-${userId || 'anonymous'}`
  const cached = fortuneCache.get(cacheKey)
  const now = Date.now()
  
  if (cached && now - cached.timestamp < 3600000) { // 1小时缓存
    return NextResponse.json(cached.data)
  }

  try {
    // 根据类型获取运势
    let result: any = null
    
    switch (type) {
      case 'daily':
        // 每日运势
        const dayOfYear = Math.floor((now - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
        result = {
          overall: getDailyFortune(dayOfYear),
          luckyDirection: ['东', '南', '西', '北'][dayOfYear % 4],
          luckyColor: ['红', '蓝', '绿', '黄', '紫', '白'][dayOfYear % 6],
          luckyNumber: ((dayOfYear * 7) % 9) + 1,
        }
        break
        
      case 'weekly':
        // 每周运势
        const weekOfYear = Math.floor(now / (86400000 * 7))
        result = {
          overall: getWeeklyFortune(weekOfYear),
          career: getWeeklyCareer(weekOfYear),
          love: getWeeklyLove(weekOfYear),
          wealth: getWeeklyWealth(weekOfYear),
        }
        break
        
      case 'monthly':
        // 每月运势
        const month = new Date().getMonth()
        result = {
          overall: getMonthlyFortune(month),
          highlight: getMonthlyHighlight(month),
          caution: getMonthlyCaution(month),
        }
        break
        
      default:
        return NextResponse.json({ error: '无效的type参数' }, { status: 400 })
    }

    // 缓存结果
    fortuneCache.set(cacheKey, { data: result, timestamp: now })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('运势计算错误:', error)
    return NextResponse.json({ error: '运势计算失败' }, { status: 500 })
  }
}

// 辅助函数
function getDailyFortune(seed: number): string {
  const fortunes = [
    "今天运势极佳，适合开展新项目！",
    "运势平稳，保持平常心即可。",
    "可能遇到一些小挑战，但能够顺利解决。",
    "人际关系运势上升，适合社交。",
    "财运不错，可以关注投资机会。",
    "工作运势旺盛，适合处理重要事务。",
    "需要多注意休息，保持身心健康。",
  ]
  return fortunes[seed % fortunes.length]
}

function getWeeklyFortune(seed: number): string {
  const fortunes = [
    "本周整体运势向好，把握机会可以取得突破。",
    "本周运势平稳，适合稳步推进计划。",
    "本周可能会有一些变化，保持灵活应对。",
    "人际关系运势上升，适合拓展人脉。",
  ]
  return fortunes[seed % fortunes.length]
}

function getWeeklyCareer(seed: number): string {
  const careers = [
    "工作顺利，有望获得晋升机会。",
    "适合开展新项目，展现能力。",
    "需要处理好人际关系，团队合作顺利。",
    "可能会遇到挑战，但能够克服。",
  ]
  return careers[seed % careers.length]
}

function getWeeklyLove(seed: number): string {
  const loves = [
    "桃花运旺盛，容易遇到心仪对象。",
    "感情稳定，适合增进与伴侣的感情。",
    "单身者可以通过朋友介绍认识新人。",
    "需要注意沟通，避免误会。",
  ]
  return loves[seed % loves.length]
}

function getWeeklyWealth(seed: number): string {
  const wealths = [
    "财运较好，可适当投资。",
    "收支平衡，适合储蓄。",
    "有意外收入的可能。",
    "需要注意理财，避免冲动消费。",
  ]
  return wealths[seed % wealths.length]
}

function getMonthlyFortune(month: number): string {
  const fortunes = [
    "本月运势平稳，适合稳扎稳打。",
    "本月事业运势上升，有望取得突破。",
    "本月财运亨通，适合开展新业务。",
    "本月感情运势旺盛，适合表白或求婚。",
    "本月健康运势良好，保持作息规律。",
    "本月人际关系运势上升，适合社交。",
    "本月学习运势旺盛，适合深造。",
    "本月旅行运势不错，可以计划出行。",
    "本月创新运势旺盛，适合尝试新事物。",
    "本月运势多变，需要灵活应对。",
    "本月需要更加谨慎，避免冲动决策。",
    "本月整体运势不错，值得期待。",
  ]
  return fortunes[month % fortunes.length]
}

function getMonthlyHighlight(month: number): string {
  const highlights = [
    "事业发展的黄金期",
    "财运收获的季节",
    "感情开花结果的时机",
    "学习提升的好时光",
    "人脉拓展的良机",
  ]
  return highlights[month % highlights.length]
}

function getMonthlyCaution(month: number): string {
  const cautions = [
    "注意保管贵重物品",
    "避免与他人发生冲突",
    "注意饮食卫生",
    "出行注意安全",
    "谨慎投资理财",
  ]
  return cautions[month % cautions.length]
}
