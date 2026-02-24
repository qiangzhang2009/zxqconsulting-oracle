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

  const prompt = `你是一位隐世多年的命理大师，精通周易八卦，擅长解读天机。你要用古老、神秘、富有智慧的语言，为求问者指点迷津。

请根据以下信息进行命理解读：

命主信息：
- 出生日期：${birthDate}
- 出生时辰：${birthTime}
- 性别：${gender === 'male' ? '男' : '女'}

八字排盘：
- 年柱：${result.yearGan}${result.yearZhi}
- 月柱：${result.monthGan}${result.monthZhi}
- 日柱：${result.dayGan}${result.dayZhi}
- 时柱：${result.hourGan}${result.hourZhi}

要求：
1. 语言要古老、深远、富有哲理，像传世的神秘典籍
2. 避免使用"运势指数"、"五行属性"、"幸运颜色"等生硬的现代词汇
3. 使用诗意的表达，如"天机"、"命理"、"阴阳"、"五行"等传统概念
4. 解读要有深度，给出人生方向的指引，强调"命运天注定，运在人改"
5. 格式用【】标注每个部分的小标题，如【命理概述】、【性格特点】、【人生指引】等
6. 字数约600-700字

请开始你的推演：`

  const aiResult = await callDeepSeek(prompt)
  if (aiResult) return aiResult
  return generateMockAnalysis('bazi', result)
}

// 生成星座运势解读
export async function generateConstellationAnalysis(data: FortuneData): Promise<string> {
  const { input, result } = data
  const { birthDate, constellation } = input

  const prompt = `你是一位古老的星辰占卜师，在星空下修行千年。你要用神秘、深邃、富有诗意的语言，为迷途者揭示命运的启示。

请根据以下信息进行解读：

星辰信息：
- 星座：${constellation}
- 出生日期：${birthDate}

要求：
1. 语言要神秘、深远、富有哲理，像古老的预言
2. 避免使用"运势指数"、"幸运数字"、"吉色"等生硬的词汇
3. 使用诗意的表达，如"星辰低语"、"命运之轮"、"天机"等
4. 解读要有深度，给出人生方向的指引
5. 格式用【】标注每个部分的小标题，如【命理概述】、【人生指引】等
6. 字数约500-600字

请开始你的占卜：`

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
  if (type === 'bazi') {
    return `【命理概述】
星辰之下，您降生于世的那一刻，命运之轮已然开始转动。您的八字承载着独特的生命密码，诉说着属于您的人生轨迹。

【性格特点】
您生来便带有独特的气场，性格中既有沉稳内敛的一面，又有热情奔放的潜能。在人群中，您往往能够凭借独特的魅力吸引他人的目光。

【人生指引】
命运之路上，机遇与挑战并存。如今正是您积累力量、静待时机的时刻。相信自己的直觉，它会引领您走向正确的方向。

【天机暗示】
在星光的指引下，您的人生正处于一个重要的转折点。保持内心清明，倾听内心的声音，命运自会为您开启新的篇章。`

  }
  
  if (type === 'constellation') {
    return `【星辰概述】
当您出生的那一刻，星辰便为您编织了独特的命运图谱。星空中的每一颗星，都映照着您的人生轨迹。

【性格特征】
您的心灵被星光滋养，拥有和洞察力。您善于独特的视野思考，往往能够在静默中领悟人生的真谛。

【命运启示】
命运的齿轮正在转动，您正站在一个全新的起点之上。星辰在远方闪烁，指引着您前进的方向。

【天意难测】
冥冥之中，命运为您准备了惊喜。保持开放的心态，迎接生命中的每一个可能。`
  }
  
  return '命运之轮正在转动，请稍后再试。'
}
