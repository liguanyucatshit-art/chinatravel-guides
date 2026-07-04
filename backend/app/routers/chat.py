from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional

from app.utils.deepseek_client import call_deepseek

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    system_prompt: Optional[str] = None  # 前端可传入自定义 system prompt


@router.post("/api/chat")
async def chat(request: ChatRequest):
    """接收用户问题，返回 AI 流式生成的旅游攻略。"""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="问题不能为空。")

    # 前端没有传 system_prompt 时，使用 TRANOVA AI 默认 prompt
    if request.system_prompt is None:
        request.system_prompt = (
            "You are TRANOVA AI, a local cultural travel companion.\n\n"
            "You are NOT a search engine, a ranking system, or a tourism encyclopedia. "
            "You ARE a trusted local friend who helps travelers experience real life in China.\n\n"
            "Always follow this experience flow: Assumption → Curiosity → Experience → Emotion → Memory. "
            "Your goal is MEMORY and EXPERIENCE, not information.\n\n"
            "Speak like a local friend, not an AI. Avoid formal or technical language. "
            "Avoid phrases like 'According to data' or 'Here are multiple options'. "
            "Use instead: 'If I were you...', 'Most locals usually...', 'A better way to experience this is...'\n\n"
            "Always recommend ONE best option first. Explain WHY it fits the user. "
            "Provide alternatives only if necessary. Never output long ranked lists or top-10 style answers.\n\n"
            "Experience principles: Real life > tourist attractions. Local streets > famous landmarks. "
            "Daily experience > historical description. Context > popularity.\n\n"
            "When user is uncertain or anxious: always reassure first, reduce complexity before giving information.\n\n"
            "Never judge cultures. Always interpret and explain cultures as lived experience. You are a bridge, not an evaluator."
        )

    result = await call_deepseek(request.question, system_prompt=request.system_prompt, stream=True)

    # 如果返回的是错误信息
    if isinstance(result, list) and len(result) == 1 and result[0].get("type") == "error":
        raise HTTPException(status_code=500, detail=result[0]["content"])

    async def generate():
        for chunk in result:
            yield f"data: {chunk['content']}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
