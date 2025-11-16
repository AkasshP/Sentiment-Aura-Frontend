import React from "react";
import useTranscription from "../hooks/useTranscription";

const MicControl: React.FC = () => {
  const {
    recording,
    connected,
    start,
    stop,
  } = useTranscription(); // uses VITE_TRANSCRIBE_WS_URL

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={recording ? stop : start}
        className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
      >
        {recording ? "Stop" : "Start"} Recording
      </button>
      <span className={`text-sm ${connected ? "text-emerald-500" : "text-zinc-400"}`}>
        {connected ? "WebSocket: connected" : "WebSocket: connecting..."}
      </span>
    </div>
  );
};

export default MicControl;
