const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Groq using OpenAI's SDK structure
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

console.log("Groq API Key status:", process.env.GROQ_API_KEY ? "CONFIGURED" : "MISSING");

/**
 * DETERMINISTIC COMPONENT REGISTRY
 * These are the ONLY components and props the AI is allowed to use.
 */
const COMPONENT_REGISTRY = {
  Navbar: { props: ['logoText', 'links'] },
  Sidebar: { props: ['items'] },
  Card: { props: ['title', 'description'] },
  Table: { props: ['headers', 'rows'] },
  Button: { props: ['label', 'variant'] },
  Input: { props: ['label', 'placeholder', 'type'] },
  Chart: { props: ['title', 'type'] },
  Modal: { props: ['title', 'isOpen'] }
};

/**
 * THE SYSTEM PROMPT
 * Enforces the Planner/Generator/Explainer logic and bans hallucinations.
 */
const SYSTEM_PROMPT = `
You are a Deterministic UI JSON Generator. You output ONLY raw JSON.

### 🔒 THE GOLDEN RULE
Use ONLY the components in this registry: ${JSON.stringify(COMPONENT_REGISTRY)}.
- NEVER use standard HTML tags (div, span, p, h1).
- NEVER use typos like "Narbar", "Sibbar", or "tritle".
- Use "Navbar", "Sidebar", and "title" exactly as written.

### 🏗️ OUTPUT STRUCTURE
{
  "planner": "Brief step-by-step architectural plan.",
  "explanation": "Why you chose these components.",
  "ui_tree": {
    "component": "ComponentName",
    "props": { ... },
    "children": [ { "component": "...", "props": { ... } } ]
  }
}

### 🔄 ITERATION RULES
- If history is provided, ONLY modify the requested parts. 
- Preserve the existing ui_tree structure unless a full rewrite is asked.
- For dashboards, use Sidebar as the root wrapper or main layout.
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
      response_format: { type: "json_object" } // Forces strict JSON output
    });

    const result = JSON.parse(completion.choices[0].message.content);

    // Normalize response to ensure keys match frontend expectations
    res.json({
      planner: result.planner || result.plan || "Plan generated.",
      ui_tree: result.ui_tree,
      explanation: result.explanation || "No explanation provided."
    });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Failed to generate UI. Check Groq API and Prompt structure." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});