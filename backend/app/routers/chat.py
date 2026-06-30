from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.utils.deepseek_client import call_deepseek

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/api/chat")
async def chat(request: ChatRequest):
    """接收用户问题，返回 AI 流式生成的旅游攻略。"""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="问题不能为空。")

    result = await call_deepseek(request.question, stream=True)

    # 如果返回的是错误信息
    if isinstance(result, list) and len(result) == 1 and result[0].get("type") == "error":
        raise HTTPException(status_code=500, detail=result[0]["content"])

    async def generate():
        for chunk in result:
            yield f"data: {chunk['content']}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
