import { useEffect, useRef, useState } from "react";

export type LogFn = (line: string) => void;

export type UseTranscriptionOptions = {
  onFinalTranscript?: (text: string) => void;
};

export type TranscriptionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "error";

const DG_WS_URL =
  "wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&language=en";

export function useTranscription(opts: UseTranscriptionOptions = {}) {
  const onFinalTranscriptRef = useRef<
    ((text: string) => void) | undefined
  >(opts.onFinalTranscript);

  useEffect(() => {
    onFinalTranscriptRef.current = opts.onFinalTranscript;
  }, [opts.onFinalTranscript]);

  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState<TranscriptionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const connected = status === "connected";

  const [finalTranscript, setFinalTranscript] = useState("");
  const [liveSegment, setLiveSegment] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const push: LogFn = (s) => {
    const line = `${new Date().toISOString()}  ${s}`;
    setMessages((prev) => [...prev, line]);
    console.log("[transcription]", line);
  };

  const transcript =
    finalTranscript +
    (liveSegment ? (finalTranscript ? " " : "") + liveSegment : "");

  const start = async () => {
    if (recording || status === "connecting") return;

    const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY as
      | string
      | undefined;

    if (!apiKey) {
      const msg = "VITE_DEEPGRAM_API_KEY not set";
      push(`error: ${msg}`);
      setError(msg);
      setStatus("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      setError(null);
      setStatus("connecting");
      push(`ws: connecting to ${DG_WS_URL}`);

      const socket = new WebSocket(DG_WS_URL, ["token", apiKey]);
      wsRef.current = socket;

      socket.onopen = () => {
        push("ws: open (Deepgram)");
        setStatus("connected");

        const rec = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });
        recRef.current = rec;

        rec.addEventListener("dataavailable", (evt) => {
          if (evt.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(evt.data);
          }
        });

        rec.start(250);
        push("rec: started");
        setRecording(true);
      };

      socket.onerror = (evt) => {
        const msg = `ws: error ${JSON.stringify(evt)}`;
        push(msg);
        setError("Transcription connection error. Please try again.");
        setStatus("error");
      };

      socket.onclose = (evt) => {
        push(`ws: closed (${evt.code} ${evt.reason || ""})`);
        setRecording(false);
        if (status !== "error") {
          setStatus("idle");
        }
      };

      socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data as string);
          const alt = data.channel?.alternatives?.[0];
          const text: string | undefined = alt?.transcript;

          if (!text || text.trim().length === 0) return;

          if (data.is_final) {
            const clean = text.trim();
            setFinalTranscript((prev) =>
              prev ? `${prev} ${clean}` : clean
            );
            setLiveSegment("");

            onFinalTranscriptRef.current?.(clean);
            push(`dg: final="${clean}"`);
          } else {
            setLiveSegment(text.trim());
          }
        } catch (e) {
          push(`ws: message parse error ${String(e)}`);
        }
      };
    } catch (err) {
      const msg = `Error accessing microphone: ${String(err)}`;
      push(`rec: ${msg}`);
      setError(msg);
      setStatus("error");
    }
  };

  const stop = () => {
    if (!recording && status !== "connected") return;

    push("rec: stopping");
    if (recRef.current && recRef.current.state === "recording") {
      recRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, "client done");
    }

    setRecording(false);
    if (status !== "error") {
      setStatus("idle");
    }
  };

  const clearTranscript = () => {
    setFinalTranscript("");
    setLiveSegment("");
  };

  useEffect(() => {
    return () => {
      if (recRef.current && recRef.current.state === "recording") {
        recRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "component unmount");
      }
    };
  }, []);

  return {
    recording,
    status,
    connected,   
    error,
    transcript,
    messages,
    start,
    stop,
    clearTranscript,
  };
}

export default useTranscription;
