# 🧠🚀 Ryze AI: Deterministic UI Generator

> An AI-powered agent that converts natural language intent into working UI code using a fixed, deterministic component library. Built for the Ryze AI Full-Stack Assignment.

---

## 🔗 Live Demo & Deployment
- **Frontend (Vercel):** https://ryze-ui-generator.vercel.app
- **Backend (Render):** https://ryze-ui-generator-backend.onrender.com
- **Demo:** https://www.loom.com/share/d392ec88ce554cb093316ff092008a9e


---

## 🏗️ Architecture Overview
The system follows a **Schema-First** approach to guarantee determinism. Instead of the AI writing arbitrary code or CSS, it generates a structured JSON "UI Tree" that maps directly to a pre-defined React library.



1. **Backend (Orchestrator):** A Node.js Express server that communicates with the Groq LPU (Llama 3.3 70B) to process intents with <500ms latency.
2. **Deterministic Registry:** A strict mapping of string identifiers to hard-coded React components.
3. **Frontend (Preview Engine):** A recursive React renderer that consumes the JSON schema and assembles the UI in real-time.

---


---

## 🧠 Agent Design & Prompts
The agent is designed as a **UI Architect**, following a multi-step reasoning process within a single inference cycle:

1. **Planner:** Interprets user intent and decides on a layout strategy (e.g., "This needs a Sidebar and a Table").
2. **Generator:** Maps the plan to the `COMPONENT_REGISTRY`, ensuring only allowed props are used.
3. **Explainer:** Provides a human-readable justification for design choices, displayed in the "AI Reasoning" panel.

**Core Prompt Strategy:**
We use **Strict JSON Schema Enforcement**. By utilizing `response_format: { type: "json_object" }` and negative constraints (banning `div`, `span`, etc.), we eliminate hallucinations and ensure the frontend never crashes.

---


---

## 🧱 Fixed Component Library
The system enforces visual consistency by isolating the AI from the styling layer. The AI selects components; the system defines the styling.
- **Components:** Navbar, Sidebar, Card, Table, Button, Input, Chart, Modal.
- **Constraints:** No inline styles, no AI-generated CSS, and no arbitrary Tailwind class generation.

---


---

## 🛠️ Technical Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide-React.
- **Backend:** Node.js, Express, Groq SDK (Llama-3.3-70b-versatile).
- **Deployment:** Vercel (Frontend), Render (Backend).

---


---

## 🚀 Getting Started


### Prerequisites
- Node.js (v18+)
- A Groq API Key


### Installation
1. **Clone the repo:**
    ```sh
    git clone https://github.com/The-morning-star23/ryze-ui-generator.git
    cd ryze-ui-generator
    ```
2. **Setup Backend:**
    ```sh
    cd backend
    npm install
    # Create a .env file:
    # GROQ_API_KEY=your_key_here PORT=5000
    npm run dev
    ```
3. **Setup Frontend:**
    ```sh
    cd frontend
    npm install
    # Create a .env file:
    # VITE_API_URL=http://localhost:5000
    npm run dev
    ```


---

## 🔁 Key Features Tested
- **Iterative Edits:** The system maintains conversation history to allow incremental UI modifications.
- **Version Rollback:** Users can instantly revert to any previous state in the generation history.
- **Safety Validation:** A middleware layer in the renderer blocks any unauthorized HTML tags or components.