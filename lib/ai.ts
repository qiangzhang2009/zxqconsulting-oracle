export interface FortuneData {
  type: 'bazi' | 'constellation' | 'zhouyi' | 'tarot'
  input: {
    birthDate?: string
    birthTime?: string
    gender?: string
    question?: string
    constellation?: string
    hexagram?: string
    card?: string
  }
  result: {
    [key: string]: any
  }
}

// DeepSeek API 调用
async function callDeepSeek(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  
  if (!apiKey) {
    console.warn('DeepSeek API key not configured, using mock analysis')
    return ''
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一位专业的中国命理师，擅长八字算命、周易解卦、塔罗牌解读。你解读风格温暖、专业、富有洞察力。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('DeepSeek API error:', error)
    return ''
  }
}

// 生成八字命理解读
export async function generateBaziAnalysis(data: FortuneData): Promise<string> {
  const { input, result } = data
  const { birthDate, birthTime, gender } = input

  const prompt = `你是一位专业的命理师，请根据以下八字信息进行详细的命理解读：

出生信息：
- 出生日期：${birthDate}
- 出生时辰：${birthTime}
- 性别：${gender}

八字排盘：
- 年柱：${result.year?.gan}${result.year?.zhi}
- 月柱：${result.month?.gan}${result.month?.zhi}
- 日柱：${result.day?.gan}${result.day?.zhi}
- 时柱：${result.hour?.gan}${result.hour?.zhi}

请从以下几个维度进行解读：
1. 命主性格分析
2. 事业运势
3. 财运分析
4. 感情婚姻
5. 健康建议
6. 2024年运势展望

请用温暖、专业、易懂的语言进行解读，字数约500字。`

  const aiResult = await callDeepSeek(prompt)
  if (aiResult) return aiResult
  return generateMockAnalysis('bazi', result)
}

// 生成星座运势解读
export async function generateConstellationAnalysis(data: FortuneData): Promise<string> {
  const { input, result } = data
  const { birthDate, constellation } = input

  const prompt = `你是一位专业的占星师，请根据以下星座信息进行详细的运势解读：

星座：${constellation}
出生日期：${birthDate}

基础运势：
- 整体运势：${result.overall}
- 爱情运势：${result.love}
- 事业运势：${result.career}
- 财运运势：${result.wealth}
- 幸运颜色：${result.luckyColor}
- 幸运数字：${result.luckyNumber}

请从以下几个维度进行深入解读：
1. 本周整体运势分析
2. 事业学业发展建议
3. 感情人际关系提示
4. 财运投资方向
5. 健康生活建议
6. 下周幸运提示

请用专业、温暖的语言进行解读，字数约400字。`

  const aiResult = await callDeepSeek(prompt)
  if (aiResult) return aiResult
  return generateMockAnalysis('constellation', result)
}

// 生成周易解卦
export async function generateZhouyiAnalysis(data: FortuneData): Promise<string> {
  const { input, result } = data
  const { question } = input

  const prompt = `你是一位专业的易经大师，请根据以下卦象进行详细的解卦：

占卜问题：${question}

卦象信息：
- 卦名：${result.name}
- 卦符号：${result.symbol}
- 卦辞：${result.meaning}
- 原文解释：${result.description}

请从以下几个维度进行解卦：
1. 卦象整体分析
2. 当前时运判断
3. 问题的具体指导
4. 建议采取的行动
5. 需要注意的事项
6. 趋吉避凶的方法

请用专业、易懂的语言进行解卦，字数约500字。`

  const aiResult = await callDeepSeek(prompt)
  if (aiResult) return aiResult
  return generateMockAnalysis('zhouyi', result)
}

// 生成塔罗牌解读
export async function generateTarotAnalysis(data: FortuneData): Promise<string> {
  const { input, result } = data
  const { question } = input

  const prompt = `你是一位专业的塔罗牌占卜师，请根据以下牌阵进行详细的牌义解读：

占卜问题：${question}

塔罗牌信息：
- 牌名：${result.name}
- 牌号：${result.number}
- 关键词：${result.keywords}
- 牌义：${result.meaning}

请从以下几个维度进行解读：
1. 牌面整体能量分析
2. 当前状态解读
3. 问题的核心提示
4. 建议与指引
5. 需要注意的方面
6. 未来发展建议

请用神秘、专业、富有洞察力的语言进行解读，字数约500字。`

  const aiResult = await callDeepSeek(prompt)
  if (aiResult) return aiResult
  return generateMockAnalysis('tarot', result)
}

// 根据类型生成对应的分析
export async function generateAnalysis(data: FortuneData): Promise<string> {
  switch (data.type) {
    case 'bazi':
      return generateBaziAnalysis(data)
    case 'constellation':
      return generateConstellationAnalysis(data)
    case 'zhouyi':
      return generateZhouyiAnalysis(data)
    case 'tarot':
      return generateTarotAnalysis(data)
    default:
      return '未知类型的分析'
  }
}

// 模拟AI生成（当没有API Key时使用）
function generateMockAnalysis(type: string, result: any): string {
  const analyses: Record<string, string> = {
    bazi: `根据您的八字命盘分析：

【命主性格】
您是${result.day?.gan || '木'}命人，性格温和善良，为人正直，具有较强的责任心和上进心。

【事业运势】
您的事业运程较为平稳，适合在稳定的环境中发展。今后在工作中可能会有贵人相助，建议把握机会。

【财运分析】
您的财运整体不错，但需要注意理财。适合进行稳健的投资，不宜过于冒险。

【感情婚姻】
您的感情运程较好，遇到了对的人要珍惜。婚后生活幸福美满。

【健康建议】
平时要注意脾胃和肝胆的健康，保持良好的作息习惯。

【2024年运势】
今年是转运的一年，各方面都有所提升。保持积极心态，好运自然来。`,

    constellation: `根据您的星座运势分析：

【整体运势】
近期运势较为平稳，整体发展趋势良好。各项工作都能顺利进行。

【事业学业】
工作状态不错，适合展现自己的能力。可以尝试新的项目和方法。

【感情运程】
感情方面有新的进展，单身者有望遇到有缘人。已有伴侣者感情稳定。

【财运提示】
财运平稳，注意理性消费。可以适当关注理财信息。

【健康生活】
注意保持良好的作息，适当运动锻炼身体。

【下周提示】
保持开放的心态，机遇将如期而至。`,

    zhouyi: `根据您所求的卦象分析：

【卦象解读】
此卦为${result.name}，${result.meaning}。卦象显示您目前正处于一个关键的转折点。

【时运判断】
当前时运较为有利，但需要耐心等待时机。不可急于求成。

【具体指导】
建议您保持冷静，稳扎稳打。遇到困难时可以寻求他人帮助。

【行动建议】
当前适合采取保守策略，不宜冒险激进。做好充分准备再行动。

【注意事项】
近期要特别注意人际关系，避免与人发生冲突。

【趋吉避凶】
保持内心平静，多行善事，好运自然降临。`,

    tarot: `根据您抽取的塔罗牌分析：

【牌面能量】
${result.name}（第${result.number}张牌）代表着${result.keywords}。这张牌的能量正在影响您的现状。

【当前状态】
您目前正处于一个重要的转变期，潜意识正在给您重要的提示。

【核心提示】
${result.name}提醒您要相信自己的直觉，跟随内心的声音。

【建议指引】
现在是时候做出改变了。相信自己的能力，勇敢迈出第一步。

【注意事项】
注意平衡工作与生活，不要过于执着于结果。

【未来发展】
保持积极的心态，您期待的好事即将发生。`
  }

  return analyses[type] || analyses.bazi
}
