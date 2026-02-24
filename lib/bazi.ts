// 八字算命核心算法
// 基于万年历和天干地支计算公式

// 天干
export const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]

// 地支
export const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

// 十二生肖
export const SHENGXIAO = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]

// 地支对应的时间
export const DIZHI_TIME: Record<string, [number, number]> = {
  "子": [23, 1],
  "丑": [1, 3],
  "寅": [3, 5],
  "卯": [5, 7],
  "辰": [7, 9],
  "巳": [9, 11],
  "午": [11, 13],
  "未": [13, 15],
  "申": [15, 17],
  "酉": [17, 19],
  "戌": [19, 21],
  "亥": [21, 23],
}

// 五行
export const WUXING = {
  "甲": "木", "乙": "木",
  "丙": "火", "丁": "火",
  "戊": "土", "己": "土",
  "庚": "金", "辛": "金",
  "壬": "水", "癸": "水",
  "子": "水", "丑": "土", "寅": "木", "卯": "木",
  "辰": "土", "巳": "火", "午": "火", "未": "土",
  "申": "金", "酉": "金", "戌": "土", "亥": "水",
}

// 纳音五行（简化版）
export const NAYIN: Record<string, string> = {
  "甲子": "海中金", "乙丑": "海中金",
  "丙寅": "炉中火", "丁卯": "炉中火",
  "戊辰": "大林木", "己巳": "大林木",
  "庚午": "路旁土", "辛未": "路旁土",
  "壬申": "剑锋金", "癸酉": "剑锋金",
  "甲戌": "山头火", "乙亥": "山头火",
  "丙子": "涧下水", "丁丑": "涧下水",
  "戊寅": "城头土", "己卯": "城头土",
  "庚辰": "白蜡金", "辛巳": "白蜡金",
  "壬午": "杨柳木", "癸未": "杨柳木",
  "甲申": "井泉水", "乙酉": "井泉水",
  "丙戌": "屋上土", "丁亥": "屋上土",
  "戊子": "霹雳火", "己丑": "霹雳火",
  "庚寅": "松柏木", "辛卯": "松柏木",
  "壬辰": "长流水", "癸巳": "长流水",
}

// 天干地支对应数字
const TIANGAN_NUM: Record<string, number> = {
  "甲": 1, "乙": 2, "丙": 3, "丁": 4, "戊": 5,
  "己": 6, "庚": 7, "辛": 8, "壬": 9, "癸": 10,
}

const DIZHI_NUM: Record<string, number> = {
  "子": 1, "丑": 2, "寅": 3, "卯": 4, "辰": 5, "巳": 6,
  "午": 7, "未": 8, "申": 9, "酉": 10, "戌": 11, "亥": 12,
}

/**
 * 计算年份天干
 * 公式：(年份 - 4) % 10
 */
export function getYearGan(year: number): string {
  const index = (year - 4) % 10
  return TIANGAN[index >= 0 ? index : index + 10]
}

/**
 * 计算年份地支
 * 公式：(年份 - 4) % 12
 */
export function getYearZhi(year: number): string {
  const index = (year - 4) % 12
  return DIZHI[index >= 0 ? index : index + 12]
}

/**
 * 计算月份天干
 * 公式：(年份天干序号 * 2 + 月份) % 10
 */
export function getMonthGan(year: number, month: number): string {
  const yearGanNum = TIANGAN_NUM[getYearGan(year)]
  const index = (yearGanNum * 2 + month) % 10
  return TIANGAN[index - 1 >= 0 ? index - 1 : index - 1 + 10]
}

/**
 * 计算月份地支
 * 公式：(月份 + 2) % 12
 */
export function getMonthZhi(month: number): string {
  const index = (month + 2) % 12
  return DIZHI[index]
}

/**
 * 计算日柱（基于蔡勒公式简化）
 * 这里使用简化算法
 */
export function getDayGanZhi(year: number, month: number, day: number): { gan: string; zhi: string } {
  // 简化的日柱计算
  // 基准日期：2000年1月1日是庚辰日
  const baseYear = 2000
  const baseMonth = 1
  const baseDay = 1
  
  // 计算距离基准日期的天数
  let days = 0
  for (let y = baseYear; y < year; y++) {
    days += isLeapYear(y) ? 366 : 365
  }
  for (let m = baseMonth; m < month; m++) {
    days += getMonthDays(year, m)
  }
  days += day - baseDay
  
  // 庚辰日的天干地支序号
  const baseGanIndex = 6 // 庚
  const baseZhiIndex = 4 // 辰
  
  const ganIndex = (baseGanIndex + days) % 10
  const zhiIndex = (baseZhiIndex + days) % 12
  
  return {
    gan: TIANGAN[ganIndex],
    zhi: DIZHI[zhiIndex],
  }
}

/**
 * 计算时辰天干
 * 公式：(日干序号 * 2 + 时辰地支序号) % 10
 */
export function getHourGan(dayGan: string, hourZhi: string): string {
  const dayGanNum = TIANGAN_NUM[dayGan]
  const hourZhiNum = DIZHI_NUM[hourZhi]
  const index = (dayGanNum * 2 + hourZhiNum) % 10
  return TIANGAN[index - 1 >= 0 ? index - 1 : index - 1 + 10]
}

/**
 * 计算时辰地支
 */
export function getHourZhi(hour: number): string {
  // 23-1点为子时
  if (hour === 23 || hour < 1) return "子"
  return DIZHI[Math.floor((hour + 1) / 2) % 12]
}

/**
 * 判断是否闰年
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * 获取月份天数
 */
function getMonthDays(year: number, month: number): number {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (month === 2 && isLeapYear(year)) return 29
  return days[month - 1]
}

/**
 * 计算完整八字
 */
export function calculateBazi(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number
): BaziResult {
  const yearGan = getYearGan(birthYear)
  const yearZhi = getYearZhi(birthYear)
  const monthGan = getMonthGan(birthYear, birthMonth)
  const monthZhi = getMonthZhi(birthMonth)
  const dayGanZhi = getDayGanZhi(birthYear, birthMonth, birthDay)
  const hourZhi = getHourZhi(birthHour)
  const hourGan = getHourGan(dayGanZhi.gan, hourZhi)

  return {
    year: { gan: yearGan, zhi: yearZhi },
    month: { gan: monthGan, zhi: monthZhi },
    day: { gan: dayGanZhi.gan, zhi: dayGanZhi.zhi },
    hour: { gan: hourGan, zhi: hourZhi },
  }
}

export interface BaziResult {
  year: { gan: string; zhi: string }
  month: { gan: string; zhi: string }
  day: { gan: string; zhi: string }
  hour: { gan: string; zhi: string }
}

/**
 * 获取八字对应的纳音
 */
export function getNayin(gan: string, zhi: string): string {
  return NAYIN[gan + zhi] || "未知"
}

/**
 * 获取日主（命主）
 */
export function getDayMaster(bazi: BaziResult): string {
  const dayGan = bazi.day.gan
  
  const masters: Record<string, string> = {
    "甲": "甲木命 - 参天大树",
    "乙": "乙木命 - 藤蔓花草",
    "丙": "丙火命 - 太阳之光",
    "丁": "丁火命 - 灯烛之火",
    "戊": "戊土命 - 高山厚土",
    "己": "己土命 - 田园之土",
    "庚": "庚金命 - 金铁之刚",
    "辛": "辛金命 - 珠玉之美",
    "壬": "壬水命 - 江河之水",
    "癸": "癸水命 - 雨露滋润",
  }
  
  return masters[dayGan] || "未知"
}

/**
 * 简化的运势分析
 */
export function analyzeCareer(bazi: BaziResult): string {
  const dayZhi = bazi.day.zhi
  const careerSigns: Record<string, string> = {
    "子": "适合从事教育、文化、艺术类工作",
    "丑": "适合从事金融、农业、管理类工作",
    "寅": "适合从事商业、政治、咨询类工作",
    "卯": "适合从事设计、艺术、创意类工作",
    "辰": "适合从事房地产、宗教、服务类工作",
    "巳": "适合从事餐饮、旅游、娱乐类工作",
    "午": "适合从事演艺、媒体、司法类工作",
    "未": "适合从事医疗、农业、服务类工作",
    "申": "适合从事技术、工程、贸易类工作",
    "酉": "适合从事金融、艺术、鉴定类工作",
    "戌": "适合从事法律、军事、管理类工作",
    "亥": "适合从事研究、神秘学、慈善类工作",
  }
  return careerSigns[dayZhi] || "命格独特，各行各业皆可发展"
}

export function analyzeLove(bazi: BaziResult): string {
  const dayGan = bazi.day.gan
  const loveSigns: Record<string, string> = {
    "甲": "感情丰富但有时过于执着",
    "乙": "温柔多情，异性缘佳",
    "丙": "热情主动，敢于表达",
    "丁": "细腻敏感，注重精神交流",
    "戊": "稳重务实，责任心强",
    "己": "包容心强，但有时被动",
    "庚": "果断坚决，但有时刚硬",
    "辛": "追求完美，浪漫敏感",
    "壬": "自由奔放，不受束缚",
    "癸": "柔情似水，依赖性强",
  }
  return loveSigns[dayGan] || "命格独特，感情运势各有不同"
}

export function analyzeWealth(bazi: BaziResult): string {
  const dayZhi = bazi.day.zhi
  const wealthSigns: Record<string, string> = {
    "子": "财来财去，需理财规划",
    "丑": "财库稳固，适合储蓄",
    "寅": "财源广进，但支出也大",
    "卯": "财运平稳，细水长流",
    "辰": "财库丰厚，有置产运势",
    "巳": "先难后易，中年后发",
    "午": "财气旺盛，善于投资",
    "未": "财运稳定，积少成多",
    "申": "财星高照，商机无限",
    "酉": "财运亨通，但需防小人",
    "戌": "财库充盈，适合创业",
    "亥": "财运流动，适合合作",
  }
  return wealthSigns[dayZhi] || "命格独特，财运各有不同"
}
