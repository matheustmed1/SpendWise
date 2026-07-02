const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf8');

const newEndpoints = `
  app.post("/api/gemini/live-price", async (req, res, next) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Missing API Key" });
      }
      const { symbol, currency } = req.body;
      const ai = new (require("@google/genai").GoogleGenAI)({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      
      const callWithRetryAndFallback = async (primaryModel, fallbackModels) => {
        const modelsToTry = [primaryModel, ...fallbackModels];
        let lastError = null;

        for (const model of modelsToTry) {
          let attempts = 3;
          let delay = 1000;
          for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
              const response = await ai.models.generateContent({
                model: model,
                contents: \`What is the current price of \${symbol} in \${currency}? Return ONLY the number, no symbols or text. If you cannot find it, return 0.\`,
                config: {
                  tools: [{ googleSearch: {} }],
                },
              });
              return response;
            } catch (err) {
              lastError = err;
              const status = err?.status || err?.response?.status;
              if (status === 429 || err?.message?.includes("exceeded your current quota")) {
                console.error(\`[Gemini] Model \${model} rate limited on attempt \${attempt}. Error: \${err.message}\`);
                if (attempt === attempts) {
                  break;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
              } else {
                console.error(\`[Gemini] Model \${model} failed or non-transient error on attempt \${attempt}. Error: \${err.message}\`);
                break;
              }
            }
          }
        }
        throw lastError || new Error("All models and retry attempts failed");
      };

      try {
        const response = await callWithRetryAndFallback("gemini-2.5-flash", ["gemini-2.0-flash", "gemini-flash-latest"]);
        const priceText = response.text?.trim() || '0';
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        res.json({ price });
      } catch (err) {
        console.error("Gemini Live Price Error:", err);
        res.json({ price: 0 });
      }
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/gemini/investment-wizard", async (req, res, next) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Missing API Key" });
      }
      
      const { messages, currency, stats } = req.body;
      const ai = new (require("@google/genai").GoogleGenAI)({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      
      const systemPrompt = \`You are an expert financial advisor and investment wizard. You help users with budgeting strategies, risk allocation, growth or dividend strategies, and investment suggestions.
      
      Here is the user's current financial context:
      Currency: \${currency}
      Total Income: \${stats.totalIncome}
      Total Expenses: \${stats.totalExpenses}
      Net Balance: \${stats.netBalance}
      Total Investments: \${stats.totalInvestments}
      Savings Rate: \${stats.savingsRate}%
      
      Keep your advice concise, practical, and well-structured using markdown.\`;
      
      const historyStr = messages.map(m => \`\${m.role === 'user' ? 'User' : 'Assistant'}: \${m.content}\`).join('\\n\\n');
      const userMessage = messages[messages.length - 1].content;
      
      const callWithRetryAndFallback = async (primaryModel, fallbackModels) => {
        const modelsToTry = [primaryModel, ...fallbackModels];
        let lastError = null;

        for (const model of modelsToTry) {
          let attempts = 3;
          let delay = 1000;
          for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
              const response = await ai.models.generateContent({
                model: model,
                contents: \`\${systemPrompt}\\n\\nChat History:\\n\${historyStr}\\n\\nUser: \${userMessage}\`,
              });
              return response;
            } catch (err) {
              lastError = err;
              const status = err?.status || err?.response?.status;
              if (status === 429 || err?.message?.includes("exceeded your current quota")) {
                console.error(\`[Gemini] Model \${model} rate limited on attempt \${attempt}. Error: \${err.message}\`);
                if (attempt === attempts) {
                  break;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
              } else {
                console.error(\`[Gemini] Model \${model} failed or non-transient error on attempt \${attempt}. Error: \${err.message}\`);
                break;
              }
            }
          }
        }
        throw lastError || new Error("All models and retry attempts failed");
      };

      try {
        const response = await callWithRetryAndFallback("gemini-2.5-flash", ["gemini-2.0-flash", "gemini-flash-latest"]);
        res.json({ text: response.text });
      } catch (err) {
        console.error("Gemini Investment Wizard Error:", err);
        res.json({ text: "AI insights are currently unavailable due to high demand. Please try again later." });
      }
    } catch (err) {
      next(err);
    }
  });
`;

serverContent = serverContent.replace(
  '// Vite middleware for development',
  newEndpoints + '\n  // Vite middleware for development'
);

fs.writeFileSync('server.ts', serverContent);
