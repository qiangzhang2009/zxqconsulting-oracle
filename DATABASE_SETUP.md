# 知几 (ZhiJi) - 数据库配置指南

## 已创建的数据库表

| 表名 | 说明 |
|------|------|
| `users` | 用户表 |
| `vip_subscriptions` | VIP订阅表 |
| `payments` | 支付记录表 |
| `constellation_records` | 星座/星盘记录 |
| `match_records` | 星座配对记录 |
| `tarot_readings` | 塔罗牌记录 |
| `bazi_records` | 八字记录 |
| `zhouyi_readings` | 周易记录 |
| `api_usage` | API使用统计 |
| `feedbacks` | 用户反馈 |

## 环境变量配置

需要在 Vercel 中配置以下环境变量：

### 1. 数据库连接
```
DATABASE_URL=postgresql://postgres.ydyxhkvatyctadpkqyty:Mt344yXTPh6VYnH4@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### 2. Supabase 配置
```
NEXT_PUBLIC_SUPABASE_URL=https://ydyxhkvatyctadpkqyty.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_70E7CfCYrzqVhVJdfoH5uQ_Y_HB4z2S
```

### 3. 其他配置（可选）
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-key
```

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 生成 Prisma 客户端：
```bash
npx prisma generate
```

3. 同步数据库（首次或修改 schema 后）：
```bash
npx prisma db push
```

4. 测试数据库连接：
```bash
npx tsx scripts/test-db.ts
```

## 使用 Prisma 客户端

在 API 路由或 Server Actions 中使用：

```typescript
import { prisma } from '@/lib/prisma'

// 查询用户
const user = await prisma.user.findUnique({
  where: { email: 'test@example.com' }
})

// 创建星座记录
const record = await prisma.constellationRecord.create({
  data: {
    birthDate: new Date('1995-06-15'),
    sunSign: '双子座',
    planetPositions: { ... }
  }
})
```

## 修改数据模型

1. 编辑 `prisma/schema.prisma`
2. 运行 `npx prisma db push` 同步到数据库
3. 运行 `npx prisma generate` 重新生成客户端
