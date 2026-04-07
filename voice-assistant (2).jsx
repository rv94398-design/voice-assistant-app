import { useState } from "react";

const ACTIONS = [
  { id: "grammar", emoji: "✍️", label: "Fix Grammar" },
  { id: "formal", emoji: "👔", label: "Make Formal" },
  { id: "casual", emoji: "😊", label: "Make Casual" },
  { id: "shorter", emoji: "✂️", label: "Make Shorter" },
  { id: "chatgpt", emoji: "🤖", label: "ChatGPT Prompt" },
  { id: "claude", emoji: "✦", label: "Claude Prompt" },
];

function getPrompt(id, text) {
  if (id === "grammar") return `Fix the grammar and spelling only. Return the corrected text with nothing else:\n\n${text}`;
  if (id === "formal") return `Rewrite in a formal professional tone. Return only the rewritten text:\n\n${text}`;
  if (id === "casual") return `Rewrite in a friendly casual tone. Return only the rewritten text:\n\n${text}`;
  if (id === "shorter") return `Make this shorter and cleaner. Return only the shortened text:\n\n${text}`;
  if (id === "chatgpt") return `Turn this into a well-structured ChatGPT prompt. Return only the prompt:\n\n${text}`;
  if (id === "claude") return `Turn this into a clear Claude AI prompt. Return only the prompt:\n\n${text}`;
}

export default function App() {
  const [screen, setScreen] = useState("home"); // home | result
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const runAction = async (action) => {
    if (!text.trim()) { setError("Please type something first!"); return; }
    setError("");
    setActiveId(action.id);
    setLoading(true);
    setScreen("result");
    setResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: getPrompt(action.id, text) }],
        }),
      });
      const data = await res.json();
      const out = data?.content?.[0]?.text || "No result returned.";
      setResult(out);
    } catch (e) {
      setResult("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const copyText = () => {
    navigator.clipboard.writeText(result).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goBack = () => {
    setScreen("home");
    setResult("");
    setLoading(false);
  };

  const useThis = () => {
    setText(result);
    setScreen("home");
    setResult("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        textarea:focus { outline: none; }
        button { cursor: pointer; border: none; font-family: inherit; }
        button:active { opacity: 0.8; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
      `}</style>

      {/* Phone shell */}
      <div style={{
        width: "min(360px, 100%)",
        minHeight: "680px",
        background: "#13131f",
        borderRadius: "32px",
        border: "1.5px solid rgba(255,255,255,0.1)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          padding: "28px 20px 22px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "28px", marginBottom: "6px" }}>🎙️</div>
          <div style={{ color: "#fff", fontSize: "18px", fontWeight: 700 }}>VoiceWrite AI</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", marginTop: "3px" }}>Your smart writing assistant</div>
        </div>

        <div style={{ flex: 1, padding: "20px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* HOME SCREEN */}
          {screen === "home" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Text input */}
              <div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                  Type your text
                </div>
                <textarea
                  value={text}
                  onChange={e => { setText(e.target.value); setError(""); }}
                  placeholder="Type anything here... e.g. 'i want to tell my boss about the project update'"
                  rows={5}
                  style={{
                    width: "100%",
                    background: "#1e1e30",
                    border: "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: "14px",
                    padding: "13px",
                    color: "#e2e8f0",
                    fontSize: "14px",
                    lineHeight: "1.55",
                    resize: "none",
                  }}
                />
                {error && <div style={{ color: "#fc8181", fontSize: "12px", marginTop: "6px" }}>{error}</div>}
              </div>

              {/* Action buttons */}
              <div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>
                  What do you want to do?
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px" }}>
                  {ACTIONS.map(action => (
                    <button
                      key={action.id}
                      onClick={() => runAction(action)}
                      style={{
                        background: text.trim() ? "#1e1e30" : "#191926",
                        border: "1.5px solid",
                        borderColor: text.trim() ? "rgba(102,126,234,0.4)" : "rgba(255,255,255,0.07)",
                        borderRadius: "13px",
                        padding: "12px 10px",
                        color: text.trim() ? "#c3dafe" : "rgba(255,255,255,0.2)",
                        fontSize: "13px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>{action.emoji}</span>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip box */}
              <div style={{
                background: "rgba(102,126,234,0.1)",
                border: "1px solid rgba(102,126,234,0.2)",
                borderRadius: "12px",
                padding: "11px 13px",
                color: "rgba(255,255,255,0.45)",
                fontSize: "12px",
                lineHeight: "1.5",
                textAlign: "center",
              }}>
                💡 In the real app, a mic button will appear above your keyboard in <strong style={{ color: "rgba(255,255,255,0.65)" }}>any app</strong> — WhatsApp, Gmail, anywhere!
              </div>
            </div>
          )}

          {/* RESULT SCREEN */}
          {screen === "result" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Back button */}
              <button onClick={goBack} style={{ background: "none", color: "rgba(255,255,255,0.4)", fontSize: "13px", textAlign: "left", padding: "0", display: "flex", alignItems: "center", gap: "5px" }}>
                ← Back
              </button>

              {/* Action label */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>{ACTIONS.find(a => a.id === activeId)?.emoji}</span>
                <span style={{ color: "#c3dafe", fontWeight: 700, fontSize: "15px" }}>{ACTIONS.find(a => a.id === activeId)?.label}</span>
              </div>

              {/* Original */}
              <div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Original</div>
                <div style={{ background: "#191926", borderRadius: "12px", padding: "11px 13px", color: "rgba(255,255,255,0.45)", fontSize: "13px", lineHeight: "1.5" }}>{text}</div>
              </div>

              {/* Result */}
              <div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Result</div>
                <div style={{
                  background: "#1e1e30",
                  border: "1.5px solid rgba(102,126,234,0.3)",
                  borderRadius: "12px",
                  padding: "13px",
                  color: "#e2e8f0",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  minHeight: "80px",
                  display: "flex",
                  alignItems: loading ? "center" : "flex-start",
                  justifyContent: loading ? "center" : "flex-start",
                }}>
                  {loading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(102,126,234,0.3)", borderTopColor: "#667eea", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                      AI is writing...
                    </div>
                  ) : result}
                </div>
              </div>

              {/* Buttons */}
              {!loading && result && (
                <div style={{ display: "flex", gap: "9px" }}>
                  <button onClick={copyText} style={{ flex: 1, padding: "13px", background: "#1e1e30", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: "13px", color: copied ? "#68d391" : "#a0aec0", fontSize: "13px", fontWeight: 700 }}>
                    {copied ? "✓ Copied!" : "📋 Copy"}
                  </button>
                  <button onClick={useThis} style={{ flex: 2, padding: "13px", background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: "13px", color: "#fff", fontSize: "13px", fontWeight: 800, boxShadow: "0 4px 16px rgba(102,126,234,0.4)" }}>
                    ✓ Use This Text
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>Powered by Claude AI · ₹199 for 2 months</span>
        </div>
      </div>
    </div>
  );
}
