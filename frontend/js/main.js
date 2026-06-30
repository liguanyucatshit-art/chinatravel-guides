// ===== 配置 =====
const API_URL = "https://chinatravel-guides-production.up.railway.app/api/chat";

// ===== Vue 3 应用 =====
const app = Vue.createApp({
  data() {
    return {
      question: "",
      messages: [],
      loading: false,
      streaming: false,
      streamingText: "",
    };
  },

  methods: {
    async sendQuestion() {
      const q = this.question.trim();
      if (!q || this.loading) return;

      // 添加用户消息
      this.messages.push({ role: "user", content: q });
      this.question = "";
      this.loading = true;
      this.streaming = true;
      this.streamingText = "";

      try {
        const resp = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q }),
        });

        if (!resp.ok) {
          this.messages.push({
            role: "assistant",
            content: "Error: " + (await resp.text()),
          });
          return;
        }

        // 尝试流式读取
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

        // 剩余数据
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
          content: "Connection error. Make sure the backend server is running on http://localhost:8000",
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
