# CONTEXT.md

## 当前进度
- 项目骨架：已完成（.gitignore + 目录结构）
- 后端核心代码：已完成
- 前端页面：基础框架已完成

## 已完成
1. 项目基础结构搭建（.gitignore、rontend/、ackend/ 目录）
2. 后端代码：
   - ackend/requirements.txt：依赖配置（已验证 Python 3.13 兼容）
   - ackend/app/main.py：FastAPI 应用入口，含 CORS 中间件
   - ackend/app/utils/deepseek_client.py：DeepSeek API 封装（流式/非流式）
   - ackend/app/routers/chat.py：POST /api/chat 接口（SSE 流式响应）
3. 前端代码：
   - rontend/index.html：Vue 3 CDN 挂载页面
   - rontend/css/style.css：移动端优先的响应式样式
   - rontend/js/main.js：Vue 3 聊天应用（含 SSE 流式消费）

## 待办
- [ ] 在项目根目录创建 .env 文件，写入 DEEPSEEK_API_KEY
- [ ] 本地启动后端验证：./venv/Scripts/python.exe -m uvicorn backend.app.main:app --reload
- [ ] 用浏览器打开 rontend/index.html 测试聊天功能

## 关键决定
- 前端采用 Vue 3 CDN（零构建工具），后端 FastAPI + DeepSeek
- 后端流式输出采用 SSE 格式，前端用 etch + ReadableStream 消费（因为 SSE 用 POST）
- main.js 中 API 地址通过 window.BACKEND_URL 配置，默认 http://localhost:8000
- 样式采用蓝白色调（#2563eb 主色），卡片式聊天气泡，桌面端 768px 断点适配
