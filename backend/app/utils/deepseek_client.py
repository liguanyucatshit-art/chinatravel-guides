import os
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv

# 从项目根目录加载 .env 文件
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")


async def call_deepseek(
    prompt: str,
    system_prompt: str = None,
    stream: bool = True,
    max_retries: int = 2,
) -> str | list[dict]:
    """
    调用 DeepSeek API，支持流式和非流式输出。
    流式模式下返回 list[dict]，每段包含 {"type": "text"|"error", "content": str}。
    非流式模式下返回完整文本字符串。
    """
    if not DEEPSEEK_API_KEY:
        return [{"type": "error", "content": "DEEPSEEK_API_KEY 未配置，请在 .env 文件中设置。"}]

    if system_prompt is None:
        system_prompt = (
            "你是一位专业的中国入境旅游顾问。你熟悉中国的旅游景点、文化习俗、美食推荐、"
            "交通方式和240小时过境免签政策。用英文回答用户的问题，语言友好、信息准确、"
            "实用性强。推荐的内容要具体，包括景点名称（中英文）、开放时间、门票价格、"
            "交通方式和游玩建议。"
        )

    url = f"{DEEPSEEK_BASE_URL.rstrip('/')}/chat/completions"
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        "stream": stream,
    }

    last_error = None
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                if stream:
                    chunks = []
                    async with client.stream("POST", url, headers=headers, json=payload) as response:
                        if response.status_code != 200:
                            error_body = await response.aread()
                            return [{
                                "type": "error",
                                "content": f"DeepSeek API 返回错误 (HTTP {response.status_code}): {error_body.decode()}"
                            }]
                        async for line in response.aiter_lines():
                            if line.startswith("data: ") and line != "data: [DONE]":
                                data = line[6:]
                                try:
                                    parsed = json.loads(data)
                                    delta = parsed.get("choices", [{}])[0].get("delta", {})
                                    content = delta.get("content", "")
                                    if content:
                                        chunks.append({"type": "text", "content": content})
                                except json.JSONDecodeError:
                                    continue
                    return chunks
                else:
                    # 非流式模式
                    response = await client.post(url, headers=headers, json=payload)
                    response.raise_for_status()
                    result = response.json()
                    return result.get("choices", [{}])[0].get("message", {}).get("content", "")

        except httpx.TimeoutException as e:
            last_error = f"请求超时（第 {attempt + 1} 次尝试）: {str(e)}"
        except httpx.RequestError as e:
            last_error = f"网络请求失败: {str(e)}"
        except Exception as e:
            last_error = f"未知错误: {str(e)}"
            break

    return [{"type": "error", "content": last_error}]
