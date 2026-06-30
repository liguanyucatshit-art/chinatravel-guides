from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# 确保 backend 目录在模块搜索路径中
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.routers import chat

app = FastAPI(title="China Travel Guide API", version="1.0.0")

# CORS 配置：允许前端静态文件跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(chat.router)


@app.get("/")
async def root():
    return {"message": "China Travel Guide API is running."}


@app.get("/health")
async def health():
    return {"status": "ok"}
