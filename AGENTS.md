# AGENTS.md – 入境旅游指南项目开发规范

> 本文件供 Codex AI 编程助手阅读，以统一代码生成、任务执行和技术决策方式。所有开发行为必须优先遵循本规范。

---

## 1. 项目概述

**项目名称**：China Travel Guide（入境旅游智能指南平台）
**目标用户**：非中国籍游客，计划来华旅行或正在中国旅行
**核心定位**：专为非中国游客设计的、以 AI 智能问答为核心驱动的入境旅游指南平台

**核心功能**：
- 多城市旅游目的地指南（景点、美食、文化、行程）
- 基于 DeepSeek API 的智能行程规划与实时问答
- 240小时过境免签政策深度解读
- 移动端优先的响应式网页设计
- 多维度游玩方案（文化体验、自然景观、美食探索等）
- 多时长行程推荐（3日/5日/7日）

**技术路线**：
- 前端：**Vue 3 CDN 方案（零构建工具）** —— 不使用 Vue CLI、Vite 或任何 Node.js 构建工具
- 后端：Python + FastAPI
- AI 引擎：DeepSeek API（兼容 OpenAI 接口规范）
- 数据库：初期 SQLite，后期可升级 PostgreSQL
- 部署：Vercel（前端静态托管）+ Railway（后端服务）
- 版本管理：Git + GitHub

---

## 2. 关键技术约束（强制执行）

### 2.1 前端约束
- **必须使用 Vue 3 CDN 引入方案**：通过 `<script src="https://unpkg.com/vue@3/dist/vue.global.js">` 引入
- **禁止使用任何 Node.js 构建工具**：不安装 Vue CLI、Vite、Webpack 等
- **禁止使用 npm/yarn/pnpm**：不创建 `package.json`，不运行 `npm install`
- **所有前端代码为静态文件**：双击 `index.html` 必须在浏览器中直接运行
- **API 请求地址必须可配置**：便于在部署时切换本地/生产环境后端地址

### 2.2 后端约束
- **必须配置 CORS 中间件**：允许所有来源（`allow_origins=["*"]`），因为前端是静态文件
- **API Key 必须通过环境变量管理**：使用 `.env` 文件存储 `DEEPSEEK_API_KEY`，严禁硬编码
- **必须支持流式输出**：对长内容生成启用 `stream=True`
- **必须包含错误处理**：超时重试和友好错误提示

### 2.3 部署约束
- **前端**：部署到 Vercel，Root Directory 设为 `frontend`
- **后端**：部署到 Railway，需在环境变量中配置 `DEEPSEEK_API_KEY`
- **自定义域名**：通过 Vercel 后台绑定，DNS 配置 CNAME 记录

---

## 3. 项目文件结构
china-travel-guide/
├── AGENTS.md # 本文件（AI 行为规范）
├── .gitignore # Git 忽略文件
├── README.md # 项目说明
│
├── frontend/ # 前端静态文件（Vue 3 CDN）
│ ├── index.html # 主页面（引入 Vue 3 CDN + CSS + JS）
│ ├── css/
│ │ └── style.css # 全局样式（移动端优先）
│ └── js/
│ └── main.js # Vue 3 应用代码（Options API）
│
├── backend/ # Python FastAPI 后端
│ ├── app/
│ │ ├── main.py # FastAPI 入口（含 CORS 配置）
│ │ ├── routers/
│ │ │ ├── init.py
│ │ │ └── chat.py # /api/chat 路由
│ │ ├── models/
│ │ │ └── init.py # Pydantic 数据模型
│ │ └── utils/
│ │ ├── init.py
│ │ └── deepseek_client.py # DeepSeek API 封装
│ ├── requirements.txt # Python 依赖
│ └── .env # 环境变量（不提交 Git）
│
└── tests/ # 测试文件（预留）
text

---

## 4. 代码生成规范

### 4.1 前端规范（Vue 3 CDN）

**Vue 实例创建方式**：
```javascript
const { createApp, ref, reactive, computed, watch, onMounted } = Vue;

const app = createApp({
  data() {
    return {
      question: '',
      messages: [],
      isLoading: false
    };
  },
  methods: {
    async sendQuestion() {
      // 调用后端 API
    }
  }
});

app.mount('#app');
HTML 结构规范：
•	Vue 挂载点必须使用 id="app"
•	数据绑定使用 {{ }} 和 v-model
•	列表渲染使用 v-for
•	事件绑定使用 @click、@keyup.enter 等
•	条件渲染使用 v-if / v-else
CSS 规范：
•	移动端优先设计（@media min-width: 768px 做桌面适配）
•	使用柔和的旅游风格配色（蓝白/米白为主）
•	卡片式布局，圆角边框
•	中英文混排时注意字体兼容性
4.2 后端规范（Python FastAPI）
路由定义：
python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/api/chat")
async def chat(request: ChatRequest):
    # 调用 deepseek_client
    pass
DeepSeek 客户端封装：
python
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1"

async def call_deepseek(prompt: str, stream: bool = True):
    # 统一封装，支持流式输出
    pass
CORS 配置（必须）：
python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
________________________________________
5. 开发工作流
5.1 本地开发流程
1.	启动后端：uvicorn backend.app.main:app --reload（终端保持运行）
2.	打开前端：用 VS Code Live Server 打开 frontend/index.html
3.	测试交互：在页面输入问题，验证是否能收到 DeepSeek 回复
5.2 Git 提交规范
•	每次完成一个可验证的功能点，提交一次
•	Commit message 使用英文，格式：<type>: <description>
•	常用 type：feat（新功能）、fix（修复）、style（样式）、refactor（重构）、docs（文档）
5.3 部署流程
1.	代码推送到 GitHub
2.	Railway 自动拉取并部署后端
3.	Vercel 自动拉取并部署前端（Root Directory = frontend）
4.	在 Vercel 后台绑定自定义域名
________________________________________
6. 环境变量管理
后端 .env 文件（不提交 Git）：
text
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
Railway 生产环境变量：
•	必须在 Railway 后台添加 DEEPSEEK_API_KEY
•	前端通过 window.BACKEND_URL 或硬编码（需在部署前修改）指向 Railway 后端地址
________________________________________
7. 内容方向指南
所有 AI 生成的内容和代码中的示例数据，必须符合以下方向：
•	目标用户：非中国籍游客，偏好英文内容
•	城市覆盖：北京、上海、广州、成都、西安、重庆等首批 10+ 城市
•	主题维度：文化体验、自然景观、美食探索、胡同烟火、宗教建筑、潮流购物、现代都市、非遗体验
•	行程时长：3日游、5日游、7日游
•	政策重点：240小时过境免签政策（适用国家55国、口岸65个、跨省深度游）
________________________________________
8. 给 AI 的特别执行指令
1.	必须使用 Vue 3 CDN 方案，不得建议用户安装 Node.js 或使用构建工具。
2.	本地测试时，后端地址使用 http://localhost:8000；部署到 Vercel 后，必须提醒用户将前端请求地址改为 Railway 公网地址。
3.	当用户遇到错误时，先读取终端/浏览器的完整报错信息，再给出修复方案。
4.	代码生成时，优先考虑移动端显示效果。
5.	内容类问题（如旅游攻略示例），请基于 240小时过境免签政策框架生成。
6.	绝不建议用户使用 WordPress，我们走自研路线。
7.	部署相关操作，优先推荐 Vercel + Railway 组合，明确告知用户操作步骤。
________________________________________
9. 参考资料
•	DeepSeek API 文档：https://platform.deepseek.com/api-docs
•	FastAPI 官方文档：https://fastapi.tiangolo.com
•	Vue 3 CDN 引入方式：https://unpkg.com/vue@3/dist/vue.global.js
•	Vercel 部署静态站点：https://vercel.com/docs/deployments
•	Railway 部署 Python 应用：https://docs.railway.com/guides/python

