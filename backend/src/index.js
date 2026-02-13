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

const COMPONENT_REGISTRY = {
  Button: { props: ['label', 'variant', 'size'] },
  Card: { props: ['title', 'description'] },
  Input: { props: ['label', 'placeholder', 'type'] },
  Table: { props: ['headers', 'rows'] },
  Navbar: { props: ['logoText', 'links'] },
  Sidebar: { props: ['items'] }
};

// THE SYSTEM PROMPT (Enforces Planner/Generator/Explainer logic)
const SYSTEM_PROMPT = `
You are an AI UI Architect. You output ONLY valid JSON.
You must build UIs using ONLY these components: ${JSON.stringify(COMPONENT_REGISTRY)}.

Your response must follow this structure:
{
  "plan": "Step-by-step logic for the layout",
  "ui_tree": {
    "component": "ComponentName",
    "props": { ... },
    "children": [ { "component": "...", "props": { ... } } ]
  },
  "explanation": "Why you chose these specific components."
}

RULES:
- No custom CSS or Tailwind classes in props.
- No new components.
- For modifications: ONLY change the specific part requested, preserve the rest of the ui_tree.
`;
 app.get('/', (req, res) => {
  res.send('Ryze AI Backend Orchestrator: System Online 🚀');
});

app.post('/api/generate', async (req, res) => {
  const { prompt, history } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history, // This allows the AI to "remember" previous versions for modifications
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Failed to generate UI" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));