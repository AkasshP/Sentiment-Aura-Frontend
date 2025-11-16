// src/lib/api.ts
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000";

export type SentimentResult = {
  sentiment: number;   // 0–1
  keywords: string[];
};

export async function analyzeText(
  text: string
): Promise<SentimentResult> {
  const res = await axios.post<SentimentResult>(
    `${API_BASE}/process_text`,
    { text }
  );
  return res.data;
}
