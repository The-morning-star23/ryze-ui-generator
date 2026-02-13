import React, { useState } from 'react';
import axios from 'axios';
import { UIRenderer } from './components/Renderer';
import { Sparkles, History, Code, Eye } from 'lucide-react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]); // Conversation history for LLM context
  const [versions, setVersions] = useState([]); // Array of generated UI states for Rollback
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  // Points to local backend in dev, or your deployed URL in production
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/api/generate`, {
        prompt,
        history: history.slice(-4).map(h => ({ role: h.role, content: h.content }))
      });
      
      const newVersion = res.data;
      
      // Update Version History for Rollback functionality
      const updatedVersions = [...versions, newVersion];
      setVersions(updatedVersions);
      setCurrentIndex(updatedVersions.length - 1);
      
      // Update Conversation History
      setHistory([
        ...history, 
        { role: 'user', content: prompt }, 
        { role: 'assistant', content: JSON.stringify(newVersion) }
      ]);
      
      setPrompt('');
    } catch (err) {
      console.error("Generation Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentData = versions[currentIndex];

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      
      {/* LEFT: Chat & History Panel */}
      <div className="w-1/4 border-r bg-white p-5 flex flex-col shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-black tracking-tighter">RYZE AI</h1>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <History className="w-3 h-3" />
            Version History
          </div>
          
          <div className="flex flex-col gap-2">
            {versions.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentIndex(i)}
                className={`text-left p-3 rounded-lg text-sm transition-all ${
                  i === currentIndex 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium' 
                  : 'hover:bg-gray-100 text-gray-600 border border-transparent'
                }`}
              >
                Version {i + 1} {i === versions.length - 1 && "(Latest)"}
              </button>
            ))}
            {versions.length === 0 && <p className="text-xs text-gray-400 italic">No versions yet...</p>}
          </div>

          {currentData && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">AI Reasoning</div>
              <div className="p-3 bg-gray-50 rounded-lg text-xs leading-relaxed text-gray-700 border border-gray-100 italic">
                {currentData.explanation}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <textarea 
            className="border border-gray-200 p-3 rounded-xl w-full h-28 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none shadow-sm"
            placeholder="Describe your UI (e.g. 'Add a login form with a blue button')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {loading ? 'Processing...' : 'Generate UI'}
          </button>
        </div>
      </div>

      {/* MIDDLE: Code View (JSON Schema) */}
      <div className="w-1/4 border-r bg-[#0d1117] text-blue-300 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed">
        <div className="flex items-center gap-2 text-gray-500 font-bold mb-6 uppercase tracking-tighter">
          <Code className="w-4 h-4" />
          Deterministic Schema
        </div>
        <pre className="bg-[#161b22] p-4 rounded-lg border border-gray-800 overflow-x-auto">
          {currentData ? JSON.stringify(currentData.ui_tree, null, 2) : '// No schema generated'}
        </pre>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="flex-1 p-10 overflow-y-auto bg-slate-100/50">
        <div className="flex items-center gap-2 text-gray-400 font-bold mb-6 uppercase tracking-widest text-[10px]">
          <Eye className="w-4 h-4" />
          Live Preview Engine
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 min-h-[600px] transition-all duration-500 ease-in-out">
          {currentData ? (
            <UIRenderer node={currentData.ui_tree} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 space-y-4 py-20">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Ready to build. Enter a prompt to generate your first UI.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;