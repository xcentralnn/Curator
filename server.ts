import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock Data
let scalers = [
  {
    id: "payment-service-scaler",
    name: "payment-service",
    namespace: "production",
    status: "Healthy",
    currentReplicas: 3,
    minReplicas: 2,
    maxReplicas: 10,
    lastScaled: new Date().toISOString(),
    strategy: "AI-Predictive",
    calculatedThreshold: "250 Mbps",
  },
  {
    id: "auth-service-scaler",
    name: "auth-service",
    namespace: "production",
    status: "Scaling",
    currentReplicas: 5,
    minReplicas: 2,
    maxReplicas: 8,
    lastScaled: new Date().toISOString(),
    strategy: "Proactive",
    calculatedThreshold: "1200 req/s",
  },
  {
    id: "orders-db-scaler",
    name: "orders-db",
    namespace: "staging",
    status: "Warning",
    currentReplicas: 1,
    minReplicas: 1,
    maxReplicas: 3,
    lastScaled: "2026-05-15T10:00:00Z",
    strategy: "Manual",
  }
];

let recommendations = [
  {
    id: "rec-1",
    scalerId: "payment-service-scaler",
    type: "UP",
    replicas: 5,
    reason: "Predicted spike in 15 minutes based on historical Friday patterns.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "rec-2",
    scalerId: "auth-service-scaler",
    type: "DOWN",
    replicas: 3,
    reason: "Low traffic period detected; optimize resources.",
    timestamp: new Date().toISOString(),
  }
];

// AI Studio automatically injects GEMINI_API_KEY
const getAIModel = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  // Use as any for constructor to avoid strict type mismatch if SDK version varies
  const ai = new (GoogleGenAI as any)(process.env.GEMINI_API_KEY);
  return ai.getGenerativeModel({ model: "gemini-1.5-flash" });
};

// API Routes
app.get("/api/scalers", (req, res) => {
  res.json(scalers);
});

app.get("/api/metrics", (req, res) => {
  // Generate random metrics for simulation
  const metrics = scalers.map(s => ({
    scalerId: s.id,
    cpu: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 80) + 20,
    timestamp: new Date().toISOString(),
  }));
  res.json(metrics);
});

app.get("/api/prometheus/metrics", (req, res) => {
  const data = [];
  let now = new Date();
  for (let i = 30; i >= 0; i--) {
    let t = new Date(now.getTime() - i * 60000);
    // Simulate real-looking waves using sine
    const wave1 = Math.sin(i * 0.5) * 20;
    const wave2 = Math.cos(i * 0.3) * 10;
    
    data.push({
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cpu: Math.floor(50 + wave1 + Math.random() * 10),
      memory: Math.floor(60 + wave2 + Math.random() * 5),
      bandwidth: Math.floor(120 + wave1 * 2 + Math.random() * 20),
    });
  }
  res.json(data);
});

app.get("/api/recommendations", (req, res) => {
  res.json(recommendations);
});

app.post("/api/panic", (req, res) => {
  console.log("PANIC BUTTON PRESSED!");
  scalers = scalers.map(s => ({ ...s, status: "Paused" }));
  res.json({ status: "All scalers paused", timestamp: new Date().toISOString() });
});

app.post("/api/ai-explain", async (req, res) => {
  const { recommendationId } = req.body;
  const rec = recommendations.find(r => r.id === recommendationId);
  
  if (!rec) return res.status(404).json({ error: "Recommendation not found" });

  try {
    const model = getAIModel();
    if (!model) throw new Error("GEMINI_API_KEY not configured or AI model unavailable");
    
    const prompt = `As the Curator AI Scaler, explain why you recommended scaling ${rec.type === 'UP' ? 'up' : 'down'} to ${rec.replicas} replicas for the service. Context: ${rec.reason}. Keep it technical and brief.`;
    
    const result = await model.generateContent(prompt);
    res.json({ explanation: result.response.text() });
  } catch (error) {
    console.error("AI Explanation Error:", error);
    res.status(500).json({ error: "Failed to generate AI explanation" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Curator Server running on http://localhost:${PORT}`);
  });
}

startServer();
