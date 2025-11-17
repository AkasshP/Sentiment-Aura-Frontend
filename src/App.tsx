import { useState } from "react";
import "./App.css";
import AuraSketch from "./components/AuraSketch";
import SentimentGauge from "./components/SentimentGauge";
import KeywordChips from "./components/KeywordChips";
import TranscriptPanel from "./components/TranscriptPanel";
import MicVisualizer from "./components/MicVisualizer";
import DebugDrawer from "./components/DebugDrawer";
import useTranscription from "./hooks/useTranscription";
import { analyzeText, type SentimentResult } from "./lib/api";

function App() {
  const [sentiment, setSentiment] = useState<number | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const {
    recording,
    status,
    error: transcriptionError,
    transcript,
    messages,
    start,
    stop,
    clearTranscript,
  } = useTranscription({
    onFinalTranscript: async (text: string) => {
      if (!text.trim()) return;
      try {
        setIsAnalyzing(true);
        setAnalysisError(null);
        const result: SentimentResult = await analyzeText(text);
        setSentiment(result.sentiment);
        setKeywords(result.keywords);
      } catch (err) {
        console.error("analyzeText failed", err);
        setAnalysisError("Failed to analyze sentiment. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    },
  });

  const handleToggleRecording = () => {
    if (recording || status === "connected" || status === "connecting") {
      stop();
    } else {
      start();
    }
  };

  const effectiveSentiment = sentiment ?? 0.5;

  const hasError = Boolean(transcriptionError || analysisError);
  const errorMessage = transcriptionError ?? analysisError ?? "";

  const connectionLabel =
    status === "connecting"
      ? "Connecting to transcription service…"
      : status === "connected"
      ? "Live transcription active"
      : status === "error"
      ? "Transcription unavailable"
      : "Mic idle";

  return (
    <div className="app-root">
      <AuraSketch sentiment={effectiveSentiment} />

      <div className="app-content">
        <header className="app-header">
          <h1 className="app-title">Sentiment Aura</h1>
          <p className="app-subtitle">
            Speak into the mic. Watch your words become a live transcript,
            sentiment gauge, and evolving audio-reactive aura powered by realtime
            transcription.
          </p>
        </header>

        {hasError && (
          <div className="app-error-banner">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => {
                // allow user to dismiss
                // (keeps logs visible in Debug Drawer)
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="app-layout">
          <section className="app-left">
            <SentimentGauge
              sentiment={effectiveSentiment}
              isAnalyzing={isAnalyzing}
            />

            <TranscriptPanel
              transcript={transcript}
              onClear={() => {
                clearTranscript();
                setSentiment(null);
                setKeywords([]);
              }}
            />

            <KeywordChips keywords={keywords} />
          </section>

          <section className="app-right">
            <div className="card live-card">
              <div className="card-header">
                <h2>Live Capture</h2>
                <span className={`status-pill status-${status}`}>
                  {status === "connected"
                    ? "Connected"
                    : status === "connecting"
                    ? "Connecting"
                    : status === "error"
                    ? "Error"
                    : "Idle"}
                </span>
              </div>
              <p className="card-description">
                Click start and begin speaking to generate the aura.
              </p>

              <div className="live-row">
                <div className="live-status">
                  <span
                    className={`status-dot dot-${status === "connected" ? "ok" : status === "error" ? "error" : "pending"}`}
                  />
                  <span className="live-label">{connectionLabel}</span>
                </div>
                <button
                  type="button"
                  className={`primary-btn ${recording || status === "connected" ? "btn-recording" : ""}`}
                  onClick={handleToggleRecording}
                >
                  {recording || status === "connected"
                    ? "Stop Recording"
                    : "Start Recording"}
                </button>
              </div>

              <div className="live-footer">
                <MicVisualizer recording={status === "connected"} />
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => {
                    clearTranscript();
                    setSentiment(null);
                    setKeywords([]);
                  }}
                >
                  Clear transcript
                </button>
              </div>
            </div>

            <DebugDrawer messages={messages} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
