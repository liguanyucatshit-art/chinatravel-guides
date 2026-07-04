# CONTEXT.md

## 当前进度
- 项目骨架：已完成
- 后端核心代码：已完成（Railway 部署运行中）
- 前端 UI：**已完成 Apple 风格改版**

## 已完成
1. 项目基础结构搭建
2. 后端代码：FastAPI + CORS + DeepSeek API + 聊天路由（已部署 Railway）
3. 前端 UI 改版（对标 Apple.com 风格）：
   - 毛玻璃固定导航栏（backdrop-filter blur）
   - 全屏 Hero 区 + 渐变遮罩 + Unsplash 背景图
   - 城市导览卡片区（6城市网格，hover动效）
   - 240小时免签政策区（4个数据指标 + 说明卡片，深色背景）
   - AI聊天区（保持SSE流式交互，重新设计了聊天气泡样式）
   - Footer 深色底部
   - 全Apple系统字体栈，灰白主色调
   - 响应式适配（手机/平板/桌面）
4. 部署修复 & 全链路验证通过：
   - Vercel 前端：https://chinatravel-guides.vercel.app
   - Railway 后端：运行中，DeepSeek API 对话正常

## 待办
- [ ] 在本地打开 frontend/index.html 验证UI效果
- [ ] 如有需要调整颜色/图片/文案
- [ ] 后续推送到 GitHub 触发 Vercel 自动部署

## 关键决定
- 前端 Vue 3 CDN（零构建工具），后端 FastAPI + DeepSeek
- 配色从 #2563eb 蓝色 → Apple 灰白黑 (#1d1d1f / #f5f5f7 / #fff)
- 版面结构：纯聊天 → 品牌落地页（Hero → 城市 → 签证 → 聊天 → Footer）
- 聊天区使用 Unsplash 图片作为城市卡片配图
- main.js 保留 SSE 流式消费逻辑，API 地址通过 window.BACKEND_URL 配置
