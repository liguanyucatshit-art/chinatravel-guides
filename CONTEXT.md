# CONTEXT.md

## 当前进度
- 项目骨架：已完成（.gitignore + 目录结构）
- 后端核心代码：已完成
- 前端页面：基础框架已完成
- 部署修复：已完成（Procfile + requirements.txt）

## 已完成
1. 项目基础结构搭建（.gitignore + 目录结构）
2. 后端代码：FastAPI 入口 + CORS + DeepSeek API 封装 + 聊天路由
3. 前端代码：Vue 3 CDN 页面 + 响应式样式 + SSE 流式交互
4. 部署修复：
   - 根目录 requirements.txt 添加 uvicorn[standard]>=0.34
   - Procfile 修正：删除末尾反斜杠，使用 \ 变量
   - 已推送到 GitHub，Railway 应自动重部署

## 待办
- [ ] 本地启动后端验证：./venv/Scripts/python.exe -m uvicorn backend.app.main:app --reload
- [ ] 用浏览器打开 frontend/index.html 测试聊天
- [ ] 检查 Railway 构建日志是否通过
- [ ] 在 Railway Variables 面板添加 DEEPSEEK_API_KEY
- [ ] 在 Railway Settings -> Public Networking 启用域名
- [ ] 测试 https://域名/docs 能否打开 FastAPI 文档
- [ ] 修改 frontend/js/main.js 中 API 地址为 Railway 公网域名

## 关键决定
- 前端采用 Vue 3 CDN（零构建工具），后端 FastAPI + DeepSeek
- 后端流式输出采用 SSE 格式，前端用 fetch + ReadableStream 消费
- main.js 中 API 地址通过 window.BACKEND_URL 配置
- 样式采用蓝白色调（#2563eb 主色），卡片式聊天气泡
- 根目录 requirements.txt 必须包含 uvicorn，Procfile 用 \
