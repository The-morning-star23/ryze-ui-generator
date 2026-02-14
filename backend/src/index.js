const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const COMPONENT_REGISTRY = {
  Navbar: { props: ['logoText', 'links'] },
  Sidebar: { props: ['items'] },
  Card: { props: ['title', 'description', 'status'] },
  Table: { props: ['headers', 'rows'] },
  Button: { props: ['label', 'variant'] },
  Input: { props: ['label', 'placeholder', 'type'] },
  Chart: { props: ['title', 'type'] },
  Modal: { props: ['title', 'isOpen'] }
};

const SYSTEM_PROMPT = `
You are a Deterministic UI JSON Generator. Output ONLY raw JSON.
CRITICAL: Use ONLY double quotes. Ensure all brackets [ ] and braces { } are balanced.

### 🔒 THE GOLDEN RULE
Use ONLY these components: ${JSON.stringify(COMPONENT_REGISTRY)}.
- NEVER use standard HTML tags (div, span, p, h1). If a user asks for a 'div', you MUST refuse and use a 'Card' or 'Sidebar' instead.
- Typo protection: Use "Navbar", "Sidebar", and "title" exactly as written.

### 🎨 STYLING & REFUSAL RULES
- BACKGROUNDS/CSS: You cannot change global backgrounds (e.g., neon pink) or use custom CSS. 
- If a user asks for an unauthorized feature (neon pink, custom div, etc.), you MUST omit it from the ui_tree and state in the "explanation" that these features are restricted by the system architecture.

### 🏗️ REQUIRED JSON STRUCTURE
{
  "planner": "Step-by-step logic",
  "explanation": "Brief reasoning + any refused unauthorized requests",
  "ui_tree": {
    "component": "Sidebar",
    "props": { "items": ["Home", "Users"] },
    "children": []
  }
}

### 🔄 ITERATION RULES
- Preserve the existing ui_tree structure.
- When adding a Table, ensure "headers" is string[] and "rows" is string[][].
`;

app.get('/', (req, res) => {
  res.send('Ryze AI Backend Orchestrator: System Online 🚀');
});

app.post('/api/generate', async (req, res) => {
  const { prompt, history = [] } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history, 
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);

    res.json({
      planner: result.planner || result.plan || "Plan generated.",
      ui_tree: result.ui_tree,
      explanation: result.explanation || "No explanation provided."
    });
  } catch (error) {
    console.error("Backend Error:", error);
    // Return a 200 with an error object instead of 500 to keep the Frontend alive
    res.json({ 
        error: "Generation failed. Please simplify the request.",
        explanation: "The AI tried to generate invalid structure or unauthorized tags." 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));