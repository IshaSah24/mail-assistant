import { useState } from "react";
import CopyClipboard from "./copyClipboard";

function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Neutral");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handleAskAI = async () => {
    if (!text.trim()) {
      alert("Please type some email content!");
      return;
    }

    setLoading(true);
    console.log("Sending to backend:");
    console.log("Email Content:", text);
    console.log("Tone:", tone);
    setAiResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/create/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailContent: text, tone }),
      });

      const data = await res.json();
      setAiResponse(data.response || data);
    } catch (err) {
      console.error("Error:", err);
      setAiResponse("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div
        className="container"
        style={{
          padding: "30px",
          fontFamily: "Arial, sans-serif",
          margin: "0 auto",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          AI Mail Assistant
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "15px",
            gap: "10px",
          }}
        >
          <label htmlFor="tone" style={{ fontWeight: "bold" }}>
            Select Tone:
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            style={{
              padding: "5px 10px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
            <option value="Friendly">Friendly</option>
            <option value="Neutral">Neutral</option>
          </select>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your email content here..."
          style={{
            width: "100%",
            height: "200px",
            resize: "none",
            overflow: "auto",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "15px",
            outline: "none",
            // backgroundColor: "#e2e2e2",
          }}
        />

        <button
          className="ask-ai"
          onClick={handleAskAI}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Generating..." : "Ask AI"}
        </button>

        {aiResponse && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#fff",
              borderRadius: "4px",
              border: "1px solid #ddd",
              whiteSpace: "pre-wrap", 
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <CopyClipboard text={aiResponse} />
            </div>
            {aiResponse}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
