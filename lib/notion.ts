import { Client } from '@notionhq/client'

// Notion客户端初始化
let notionClient: Client | null = null

export function getNotionClient() {
  if (!process.env.NOTION_API_KEY) {
    console.warn('Notion API key not configured')
    return null
  }
  
  if (!notionClient) {
    notionClient = new Client({ auth: process.env.NOTION_API_KEY })
  }
  return notionClient
}

// Notion数据库ID
const DATABASE_IDS = {
  users: process.env.NOTION_USERS_DATABASE_ID,
  fortuneRecords: process.env.NOTION_FORTUNE_RECORDS_DATABASE_ID,
  orders: process.env.NOTION_ORDERS_DATABASE_ID,
  memberships: process.env.NOTION_MEMBERSHIPS_DATABASE_ID,
}

// 用户相关操作
export async function createUser(userData: {
  phone?: string
  email?: string
  name?: string
  birthDate?: string
  gender?: string
}) {
  const notion = getNotionClient()
  if (!notion || !DATABASE_IDS.users) {
    // 演示模式返回模拟数据
    return { id: 'demo-user-' + Date.now(), ...userData }
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: DATABASE_IDS.users },
      properties: {
        Name: { title: [{ text: { content: userData.name || '用户' } }] },
        Phone: { rich_text: [{ text: { content: userData.phone || '' } }] },
        Email: { rich_text: [{ text: { content: userData.email || '' } }] },
        BirthDate: { date: { start: userData.birthDate || '' } },
        Gender: { select: { name: userData.gender || '未知' } },
        CreatedTime: { date: { start: new Date().toISOString() } },
      },
    })
    return response
  } catch (error) {
    console.error('Notion create user error:', error)
    return { id: 'error', ...userData }
  }
}

export async function getUserByPhone(phone: string) {
  const notion = getNotionClient()
  if (!notion || !DATABASE_IDS.users) {
    return null
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.users,
      filter: {
        property: 'Phone',
        rich_text: { equals: phone },
      },
    })
    return response.results[0] || null
  } catch (error) {
    console.error('Notion query user error:', error)
    return null
  }
}

// 算命记录相关操作
export async function createFortuneRecord(recordData: {
  userId: string
  type: string
  inputData: any
  result: any
  aiAnalysis?: string
  isPremium?: boolean
}) {
  const notion = getNotionClient()
  if (!notion || !DATABASE_IDS.fortuneRecords) {
    return { id: 'demo-record-' + Date.now(), ...recordData }
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: DATABASE_IDS.fortuneRecords },
      properties: {
        UserId: { rich_text: [{ text: { content: recordData.userId } }] },
        Type: { select: { name: recordData.type } },
        InputData: { rich_text: [{ text: { content: JSON.stringify(recordData.inputData) } }] },
        Result: { rich_text: [{ text: { content: JSON.stringify(recordData.result) } }] },
        AIAnalysis: { rich_text: [{ text: { content: recordData.aiAnalysis || '' } }] },
        IsPremium: { checkbox: recordData.isPremium || false },
        CreatedTime: { date: { start: new Date().toISOString() } },
      },
    })
    return response
  } catch (error) {
    console.error('Notion create record error:', error)
    return { id: 'error', ...recordData }
  }
}

export async function getFortuneRecordsByUserId(userId: string) {
  const notion = getNotionClient()
  if (!notion || !DATABASE_IDS.fortuneRecords) {
    return []
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.fortuneRecords,
      filter: {
        property: 'UserId',
        rich_text: { equals: userId },
      },
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    })
    return response.results
  } catch (error) {
    console.error('Notion query records error:', error)
    return []
  }
}

// 订单相关操作
export async function createOrder(orderData: {
  userId: string
  type: string
  amount: number
  status?: string
}) {
  const notion = getNotionClient()
  if (!notion || !DATABASE_IDS.orders) {
    return { id: 'demo-order-' + Date.now(), ...orderData }
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: DATABASE_IDS.orders },
      properties: {
        UserId: { rich_text: [{ text: { content: orderData.userId } }] },
        Type: { select: { name: orderData.type } },
        Amount: { number: orderData.amount },
        Status: { select: { name: orderData.status || 'PENDING' } },
        CreatedTime: { date: { start: new Date().toISOString() } },
      },
    })
    return response
  } catch (error) {
    console.error('Notion create order error:', error)
    return { id: 'error', ...orderData }
  }
}

// 会员相关操作
export async function createMembership(membershipData: {
  userId: string
  type: string
  startDate: string
  endDate: string
  isActive?: boolean
}) {
  const notion = getNotionClient()
  if (!notion || !DATABASE_IDS.memberships) {
    return { id: 'demo-membership-' + Date.now(), ...membershipData }
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: DATABASE_IDS.memberships },
      properties: {
        UserId: { rich_text: [{ text: { content: membershipData.userId } }] },
        Type: { select: { name: membershipData.type } },
        StartDate: { date: { start: membershipData.startDate } },
        EndDate: { date: { start: membershipData.endDate } },
        IsActive: { checkbox: membershipData.isActive !== false },
        CreatedTime: { date: { start: new Date().toISOString() } },
      },
    })
    return response
  } catch (error) {
    console.error('Notion create membership error:', error)
    return { id: 'error', ...membershipData }
  }
}

export async function getActiveMembership(userId: string) {
  const notion = getNotionClient()
  if (!notion || !DATABASE_IDS.memberships) {
    return null
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.memberships,
      filter: {
        and: [
          { property: 'UserId', rich_text: { equals: userId } },
          { property: 'IsActive', checkbox: { equals: true } },
        ],
      },
    })
    return response.results[0] || null
  } catch (error) {
    console.error('Notion query membership error:', error)
    return null
  }
}
