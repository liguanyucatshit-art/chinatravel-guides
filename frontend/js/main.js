// ========== 配置 ==========
const API_URL = (window.BACKEND_URL || "http://localhost:8000") + "/api/chat";

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
  { name: "Beijing", highlight: "Imperial palaces, hutongs, and the Great Wall", tags: ["History", "Culture", "Food"], img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&q=80" },
  { name: "Shanghai", highlight: "Futuristic skyline, art deco, and world-class dining", tags: ["Modern", "Shopping", "Nightlife"], img: "https://images.unsplash.com/photo-1537531383495-f8130c8f1cc6?w=400&q=80" },
  { name: "Chengdu", highlight: "Spicy Sichuan cuisine, giant pandas, and tea houses", tags: ["Food", "Nature", "Culture"], img: "https://images.unsplash.com/photo-1609954115567-22ef1aa31c3c?w=400&q=80" },
  { name: "Xi'an", highlight: "Terracotta Warriors, ancient city walls, and Muslim Quarter", tags: ["History", "Architecture"], img: "https://images.unsplash.com/photo-1624534539723-4ccb30676857?w=400&q=80" },
  { name: "Guangzhou", highlight: "Cantonese cuisine, night markets, and historic temples", tags: ["Food", "Shopping"], img: "https://images.unsplash.com/photo-1574424693506-6db5a588fc88?w=400&q=80" },
  { name: "Chongqing", highlight: "Spicy hotpot, mountain city views, and Yangtze cruises", tags: ["Food", "Scenery"], img: "https://images.unsplash.com/photo-1599733589046-10c7f0f8c0f8?w=400&q=80" },
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
