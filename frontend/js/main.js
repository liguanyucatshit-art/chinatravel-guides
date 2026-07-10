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
  { name: "Shanghai", highlight: "Futuristic skyline, world-class dining, and the Bund", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1537531383495-f8130c8f1cc6?w=400&q=80" },
  { name: "Beijing", highlight: "Imperial palaces, the Great Wall, and hidden hutong alleys", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&q=80" },
  { name: "Guangzhou", highlight: "Cantonese cuisine, night markets, and historic temples", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1574424693506-6db5a588fc88?w=400&q=80" },
  { name: "Shenzhen", highlight: "Tech hub, modern architecture, and gateway to Hong Kong", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1584931423298-c576fda5bd11?w=400&q=80" },
  { name: "Chengdu", highlight: "Sichuan spice, giant pandas, and laid-back tea houses", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1609954115567-22ef1aa31c3c?w=400&q=80" },
  { name: "Xi'an", highlight: "Terracotta Warriors, ancient city walls, and the Muslim Quarter", tags: ["Hot", "Visa-Free"], img: "https://images.unsplash.com/photo-1624534539723-4ccb30676857?w=400&q=80" },
  { name: "Hangzhou", highlight: "West Lake, tea plantations, and water towns", tags: ["Hot"], img: "https://images.unsplash.com/photo-1599571234909-29ed5e34c0d2?w=400&q=80" },
  { name: "Chongqing", highlight: "Mountain city views, spicy hotpot, and neon-lit nights", tags: ["Hot"], img: "https://images.unsplash.com/photo-1599733589046-10c7f0f8c0f8?w=400&q=80" },
  { name: "Guilin", highlight: "Limestone peaks, Li River cruises, and rural scenery", tags: ["Hot"], img: "https://images.unsplash.com/photo-1537531383495-f8130c8f1cc6?w=400&q=80" },
  { name: "Kunming", highlight: "Eternal spring, Stone Forest, and gateway to Yunnan", tags: ["Hot"], img: "https://images.unsplash.com/photo-1590664863008-6678e7c7d0c0?w=400&q=80" },
  { name: "Sanya", highlight: "Tropical beaches, coral reefs, and resort getaways", tags: ["Hot"], img: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400&q=80" },
  { name: "Zhangjiajie", highlight: "Avatar mountains, glass bridges, and misty peaks", tags: ["Hot"], img: "https://images.unsplash.com/photo-1535025189520-5c1b23d2f1b8?w=400&q=80" },
  { name: "Xiamen", highlight: "Gulangyu Island, coastal vibes, and colonial architecture", tags: ["Hot"], img: "https://images.unsplash.com/photo-1580745273985-717c38a75ffa?w=400&q=80" },
  { name: "Suzhou", highlight: "Classic gardens, silk canals, and water town charm", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Nanjing", highlight: "Ancient capital, Confucius Temple, and cherry blossoms", tags: ["Hot"], img: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&q=80" },
  { name: "Qingdao", highlight: "Tsingtao beer, German architecture, and coastal escapes", tags: ["Hot"], img: "https://images.unsplash.com/photo-1592136968227-5e8f6a8f3b0a?w=400&q=80" },
  { name: "Lijiang", highlight: "Ancient old town, Jade Dragon Snow Mountain, and Naxi culture", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Dalian", highlight: "Russian-Japanese architecture, coastal roads, and seafood", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Changsha", highlight: "Modern youth culture, street food, and Orange Island", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Wuhan", highlight: "Yellow Crane Tower, Yangtze River cruises, and cherry blooms", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Harbin", highlight: "Ice festival, Russian architecture, and winter wonderland", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Tianjin", highlight: "Five Great Avenues, blend of East and West, gateway from Beijing", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Luoyang", highlight: "Longmen Grottoes, peony festival, and ancient heritage", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Huangshan", highlight: "Yellow Mountain peaks, hot springs, and Huizhou villages", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Dunhuang", highlight: "Mogao Caves, Singing Sand Dunes, and Silk Road history", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Xishuangbanna", highlight: "Tropical rainforest, Dai culture, and elephant sanctuaries", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Guiyang", highlight: "Huangguoshu Waterfall, minority villages, and green escapes", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Lhasa", highlight: "Potala Palace, Tibetan culture, and plateau landscapes", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Nanning", highlight: "ASEAN gateway, Vietnamese border, and tropical greenery", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
  { name: "Hohhot", highlight: "Grasslands, Mongolian culture, and desert adventures", tags: ["Hot"], img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80" },
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


