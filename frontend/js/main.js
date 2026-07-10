// ========== 配置 ==========
const API_URL = (window.BACKEND_URL || "https://chinatravel-guides-production.up.railway.app") + "/api/chat";

// ========== TRANOVA AI System Prompt ==========
const TRANOVA_BASE_PROMPT = `You are TRANOVA AI, a local cultural travel companion.

================================================
1. ROLE DEFINITION
================================================

You are NOT:
- a search engine
- a ranking system
- a tourism encyclopedia

You ARE:
A trusted local friend who helps travelers experience real life in China.

================================================
2. CORE BEHAVIOR MODEL
================================================

Always follow this experience flow:

Assumption -> Curiosity -> Experience -> Emotion -> Memory

Your goal is NOT information.
Your goal is MEMORY and EXPERIENCE.

================================================
3. RESPONSE STYLE RULES
================================================

- Speak like a local friend, not an AI
- Avoid formal or technical language
- Avoid phrases like:
  - "According to data"
  - "Here are multiple options"

Use instead:
- "If I were you..."
- "Most locals usually..."
- "A better way to experience this is..."

================================================
4. RECOMMENDATION LOGIC (STRICT)
================================================

Always:

1. Recommend ONE best option first
2. Explain WHY it fits the user
3. Provide alternatives only if necessary

Never:
- output long ranked lists
- give generic top-10 style answers

================================================
5. EXPERIENCE PRINCIPLES
================================================

- Real life > tourist attractions
- Local streets > famous landmarks
- Daily experience > historical description
- Context > popularity

================================================
6. EMOTIONAL PRINCIPLES
================================================

When user is uncertain or anxious:

- Always reassure first
- Reduce complexity before giving information

================================================
7. CULTURAL POSITIONING
================================================

Never judge cultures.

Always interpret and explain cultures as lived experience.

You are a bridge, not an evaluator.`;

// ========== Prompt Builder ==========
function buildSystemPrompt(userContext = {}) {
  const contextBlock = `
USER CONTEXT:
- Language: ${userContext.language || "English"}
- Travel Stage: ${userContext.stage || "planning"}
- Location Interest: ${userContext.location || "China"}
`;

  const behaviorLayer = `
OUTPUT REQUIREMENTS:

- Always recommend ONE best experience first
- Speak like a local friend
- Reduce user anxiety before explaining details
- Avoid listing multiple options unless asked
- Focus on real-life experiences over tourist attractions
`;

  const outputFormat = `
STYLE RULES:

- Natural, conversational tone
- No AI-style explanations
- No ranking lists
- Use "If I were you..." style reasoning
`;

  return TRANOVA_BASE_PROMPT + contextBlock + behaviorLayer + outputFormat;
}

// ========== 格式化 AI 输出 ==========
function formatAIOutput(text) {
  if (!text) return "";
  // Markdown **加粗** → <strong class="loc-name">（自动换行、大字号）
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="loc-name">$1</strong>')
    // 换行转 <br>
    .replace(/\n/g, '<br>');
  return html;
}

// ========== 示例城市数据 ==========
const citiesData = [
  { name: "Shanghai", highlight: "第一大入境口岸，240小时覆盖长三角联动", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1537531383495-f8130c8f1cc6?w=400&q=80" },
  { name: "Beijing", highlight: "故宫/长城，历史文化核心目的地", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&q=80" },
  { name: "Guangzhou", highlight: "广交会+商贸客流基本盘，大湾区枢纽", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1574424693506-6db5a588fc88?w=400&q=80" },
  { name: "Shenzhen", highlight: "毗邻香港，240小时让入境深度游更方便", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1584931423298-c576fda5bd11?w=400&q=80" },
  { name: "Chengdu", highlight: "大熊猫+美食，240小时可覆盖川西(九寨沟)", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1609954115567-22ef1aa31c3c?w=400&q=80" },
  { name: "Xi'an", highlight: "兵马俑，欧美历史游首选", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1624534539723-4ccb30676857?w=400&q=80" },
  { name: "Hangzhou", highlight: "西湖+古镇，东南亚游客增长最快之一", tags: ["Hot"], img: "https://images.unsplash.com/photo-1599571234909-29ed5e34c0d2?w=400&q=80" },
  { name: "Chongqing", highlight: "洪崖洞/山城夜景，社交媒体热度居高不下", tags: ["Hot"], img: "https://images.unsplash.com/photo-1599733589046-10c7f0f8c0f8?w=400&q=80" },
  { name: "Guilin", highlight: "漓江阳朔，传统观光型标杆", tags: ["Hot"], img: "https://images.unsplash.com/photo-1537531383495-f8130c8f1cc6?w=400&q=80" },
  { name: "Kunming", highlight: "云南门户，240小时能走经典滇西北线", tags: ["Hot"], img: "https://images.unsplash.com/photo-1590664863008-6678e7c7d0c0?w=400&q=80" },
  { name: "Sanya", highlight: "热带海滩度假，部分国家免签入境", tags: ["Hot"], img: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400&q=80" },
  { name: "Zhangjiajie", highlight: "韩国游客爆发式增长，阿凡达取景地", tags: ["Hot"], img: "https://images.unsplash.com/photo-1535025189520-5c1b23d2f1b8?w=400&q=80" },
  { name: "Xiamen", highlight: "鼓浪屿+海滨城市，台湾/东南亚客源稳定", tags: ["Hot"], img: "https://images.unsplash.com/photo-1580745273985-717c38a75ffa?w=400&q=80" },
  { name: "Suzhou", highlight: "古典园林+水乡古镇，日韩客群偏好高", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Nanjing", highlight: "六朝古都+夫子庙，高铁网络辐射广", tags: ["Hot"], img: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&q=80" },
  { name: "Qingdao", highlight: "啤酒节+德式建筑+滨海度假", tags: ["Hot"], img: "https://images.unsplash.com/photo-1592136968227-5e8f6a8f3b0a?w=400&q=80" },
  { name: "Lijiang", highlight: "古城+玉龙雪山，240小时可串联大理", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Dalian", highlight: "俄日建筑+滨海路，日韩俄客源稳", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Changsha", highlight: "茶颜悦色+文和友+橘子洲，东南亚年轻人新宠", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Wuhan", highlight: "黄鹤楼+长江游轮+樱花季，中部唯一入境枢纽", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Harbin", highlight: "冰雪大世界，俄式建筑，俄韩游客多", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Tianjin", highlight: "近北京+五大道洋楼，分流北京溢出客流", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Luoyang", highlight: "龙门石窟+牡丹花会，历史文化深度游", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Huangshan", highlight: "黄山风景区+徽派古村落，摄影爱好者多", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Dunhuang", highlight: "莫高窟+鸣沙山，丝绸之路核心目的地", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Xishuangbanna", highlight: "热带雨林+傣族文化，东南亚陆路客源", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Guiyang", highlight: "黄果树瀑布+少数民族村寨，小众深度游上升", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Lhasa", highlight: "布达拉宫+高原风光，探险/文化型游客", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Nanning", highlight: "东盟博览会+毗邻越南，东南亚陆路入境口", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Hohhot", highlight: "草原+蒙古族文化，入境游新增长点", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
];

// ========== 示例快速提问 ==========
const sampleQuestionsList = [
  "Best 5-day itinerary for Beijing?",
  "What food must I try in Chengdu?",
  "How does the 240-hour visa work?",
  "Top attractions in Shanghai?",
  "Is WeChat Pay necessary for tourists?",
];

// ========== Vue 3 应用 ==========
const app = Vue.createApp({
  data() {
    return {
      // 导航滚动检测
      scrolled: false,
      // 聊天数据
      question: "",
      messages: [],
      loading: false,
      streaming: false,
      streamingText: "",
      // 自动滚动控制
      autoScroll: true,
      // 城市与提问列表
      cities: citiesData,
      sampleQuestions: sampleQuestionsList,
      // 用户上下文
      userContext: {
        language: "English",
        stage: "planning",
        location: "China",
      },
    };
  },

  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  },

  watch: {
    // 消息变化时自动滚动
    messages: {
      handler() {
        this.$nextTick(() => this.scrollToBottom());
      },
      deep: true,
    },
    // 流式文本变化时自动滚动
    streamingText() {
      this.$nextTick(() => this.scrollToBottom());
    },
  },

  methods: {
    onScroll() {
      this.scrolled = window.scrollY > 20;
    },

    scrollToBottom() {
      if (!this.autoScroll) return;
      const el = this.$refs.chatArea;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    },

    onChatScroll() {
      const el = this.$refs.chatArea;
      if (!el) return;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
      this.autoScroll = isNearBottom;
    },

    quickQuestion(q) {
      this.question = q;
      this.$nextTick(() => {
        this.sendQuestion();
      });
    },

    formatContent(content) {
      return formatAIOutput(content);
    },

    async sendQuestion() {
      const q = this.question.trim();
      if (!q || this.loading) return;

      this.messages.push({ role: "user", content: q });
      this.question = "";
      this.loading = true;
      this.streaming = true;
      this.streamingText = "";
      // 发新消息时恢复自动滚动
      this.autoScroll = true;

      const systemPrompt = buildSystemPrompt(this.userContext);

      try {
        const resp = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            system_prompt: systemPrompt,
          }),
        });

        if (!resp.ok) {
          this.messages.push({
            role: "assistant",
            content: "Error: " + (await resp.text()),
          });
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const t = line.trim();
            if (t.startsWith("data: ") && t !== "data: [DONE]") {
              const chunk = t.slice(6);
              if (chunk) {
                fullText += chunk;
                this.streamingText = fullText;
              }
            }
          }
        }

        const last = buffer.trim();
        if (last.startsWith("data: ") && last !== "data: [DONE]") {
          const chunk = last.slice(6);
          if (chunk) {
            fullText += chunk;
            this.streamingText = fullText;
          }
        }

        if (fullText) {
          this.messages.push({ role: "assistant", content: fullText });
        }
      } catch (err) {
        this.messages.push({
          role: "assistant",
          content: "Connection error. Make sure the backend server is running. Please try again later.",
        });
      } finally {
        this.loading = false;
        this.streaming = false;
        this.streamingText = "";
      }
    },
  },
});

app.mount("#app");

