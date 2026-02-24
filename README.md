# 命运方舟 - Fortune Insight

结合传统命理学与AI技术的智能算命应用

## 功能特点

- **八字算命** - 完整的天干地支计算算法，支持命主分析、事业、财运、感情解读
- **星座运势** - 12星座每日每周运势查询，含爱情、事业、财运详解
- **周易占卜** - 随机卦象抽取与专业解卦
- **塔罗牌** - 22张主牌抽取与深度解读
- **AI智能解读** - 基于GPT的个性化命理解读
- **会员系统** - 月卡/年卡/终身VIP多种订阅方式
- **用户系统** - 手机号登录、历史记录保存

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS + shadcn/ui
- Prisma ORM
- PostgreSQL
- NextAuth.js
- OpenAI API

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd fortune-insight
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填写配置：

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/fortune_insight"

# NextAuth配置
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI配置（可选，用于AI解读）
OPENAI_API_KEY="sk-your-openai-api-key"

# 微信支付配置（可选）
WECHAT_PAY_MCHID=""
WECHAT_PAY_APIKEY=""
```

### 4. 初始化数据库

```bash
npx prisma generate
npx prisma db push
```

### 5. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
├── app/                        # Next.js App Router
│   ├── page.tsx               # 首页
│   ├── layout.tsx             # 根布局
│   ├── globals.css            # 全局样式
│   ├── bazi/                 # 八字算命
│   │   └── page.tsx
│   ├── constellation/         # 星座运势
│   │   └── page.tsx
│   ├── zhouyi/               # 周易占卜
│   │   └── page.tsx
│   ├── tarot/                # 塔罗牌
│   │   └── page.tsx
│   ├── vip/                  # 会员页面
│   │   └── page.tsx
│   ├── login/                # 登录页面
│   │   └── page.tsx
│   └── api/                  # API路由
│       ├── auth/              # 认证API
│       ├── fortune/           # 运势API
│       ├── ai/                # AI分析API
│       └── payment/          # 支付API
├── components/                # React组件
│   ├── ui/                   # UI组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── providers.tsx         #  Providers
├── lib/                      # 工具函数
│   ├── utils.ts              # 通用工具
│   ├── db.ts                 # 数据库客户端
│   ├── auth.ts               # NextAuth配置
│   ├── bazi.ts              # 八字算法
│   └── ai.ts                # AI分析
├── prisma/                   # 数据库模型
│   └── schema.prisma
├── types/                    # TypeScript类型
│   └── next-auth.d.ts
└── public/                   # 静态资源
```

## 盈利模式

| 模式 | 说明 | 价格 |
|------|------|------|
| 免费版 | 每日3次基础算命 | 免费 |
| 单次付费 | 详细命理解读 | 9.9-29.9元 |
| 月卡会员 | 无限算命+AI解读 | 29元/月 |
| 年卡会员 | 全部功能 | 199元/年 |
| 终身VIP | 一对一服务 | 699元 |

## 部署

### Vercel部署（推荐）

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署

### Docker部署

```bash
# 构建镜像
docker build -t fortune-insight .

# 运行容器
docker run -p 3000:3000 --env-file .env.local fortune-insight
```

## 环境要求

- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key（可选）

## 注意事项

- 本应用仅供娱乐参考，请勿迷信
- 使用AI功能需要配置OpenAI API Key
- 支付功能需要申请微信/支付宝商户号

## 许可证

MIT
