import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraOff, LoaderCircle, RotateCcw, Square } from "lucide-react";
import { getHandLandmarker } from "@/lib/mediapipe";
import { featuresFromLandmarks, type Landmark } from "@/lib/hand-features";
import { classify, Smoother, type Prediction } from "@/lib/classifier";
import { Button } from "@/components/ui/button";

type Props = {
  onStable: (p: Prediction) => void;
  live?: (p: Prediction | null) => void;
  enabled: boolean;
};

export function CameraStage({ onStable, live, enabled }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [fps, setFps] = useState(0);
  const [handsDetected, setHandsDetected] = useState(0);
  const smoother = useRef(new Smoother());
  const previousWrists = useRef(new Map<string, Landmark>());
  const raf = useRef(0);
  const lastFpsAt = useRef(0);
  const framesSinceFps = useRef(0);

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    smoother.current.reset();
    previousWrists.current.clear();
    setRunning(false);
    setFps(0);
    setHandsDetected(0);
    live?.(null);
  }, [live]);

  async function start() {
    setError(null);
    setLoading(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("This browser does not support camera access.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24, max: 30 },
        },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("Camera preview could not be initialized.");
      video.srcObject = stream;
      await video.play();
      await getHandLandmarker();
      setRunning(true);
    } catch (e) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      const msg = e instanceof Error ? e.message : "Camera unavailable.";
      if (msg.toLowerCase().includes("permission") || msg.includes("NotAllowed")) {
        setError("Camera permission was denied. Allow camera access and try again.");
      } else if (msg.includes("NotFound") || msg.toLowerCase().includes("camera")) {
        setError("No usable camera was found in this browser.");
      } else {
        setError("The camera could not start. Check browser permissions and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => () => stop(), [stop]);

  useEffect(() => {
    if (!running || !enabled) return;
    let lastVideoTime = -1;

    const loop = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        raf.current = requestAnimationFrame(loop);
        return;
      }

      try {
        const lm = await getHandLandmarker();
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          const result = lm.detectForVideo(video, performance.now());
          const ctx = canvas.getContext("2d");
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;

          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const styles = getComputedStyle(canvas);
            const accent = styles.getPropertyValue("--color-accent").trim() || "currentColor";
            const accentSoft = styles.getPropertyValue("--color-accent-soft").trim() || "currentColor";
            const hands = result.landmarks ?? [];
            hands.forEach((hand) => {
              ctx.strokeStyle = accentSoft;
              ctx.fillStyle = accent;
              ctx.lineWidth = 2;
              for (let i = 0; i < hand.length; i += 1) {
                const p = hand[i];
                ctx.beginPath();
                ctx.arc(p.x * canvas.width, p.y * canvas.height, 3.5, 0, Math.PI * 2);
                ctx.fill();
              }
              const wrist = hand[0];
              ctx.strokeStyle = accentSoft;
              ctx.beginPath();
              ctx.arc(wrist.x * canvas.width, wrist.y * canvas.height, 10, 0, Math.PI * 2);
              ctx.stroke();
            });
          }

          const hands = result.landmarks ?? [];
          setHandsDetected(hands.length);
          const observedLabels = new Set<string>();
          const observed = hands.map((hand, index) => {
            const label = result.handednesses?.[index]?.[0]?.categoryName ?? `hand-${index}`;
            observedLabels.add(label);
            const previous = previousWrists.current.get(label) ?? null;
            const feat = featuresFromLandmarks(hand as Landmark[], label, previous);
            previousWrists.current.set(label, feat.wrist);
            return feat;
          });

          for (const key of previousWrists.current.keys()) {
            if (!observedLabels.has(key)) previousWrists.current.delete(key);
          }

          if (observed.length) {
            const pred = classify(observed);
            live?.(pred);
            const stable = smoother.current.push(pred);
            if (stable) onStable(stable);
          } else {
            previousWrists.current.clear();
            setHandsDetected(0);
            smoother.current.reset();
            live?.(null);
          }

          framesSinceFps.current += 1;
          const now = performance.now();
          if (!lastFpsAt.current) lastFpsAt.current = now;
          if (now - lastFpsAt.current >= 1000) {
            setFps(Math.round((framesSinceFps.current * 1000) / (now - lastFpsAt.current)));
            framesSinceFps.current = 0;
            lastFpsAt.current = now;
          }
        }
      } catch {
      }
      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [running, enabled, live, onStable]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-ink shadow-card">
      <div className="relative aspect-[4/3] bg-ink">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full -scale-x-100 object-cover opacity-90"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100" />

        {running ? (
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1.5 text-xs text-bg backdrop-blur-sm">
            <span className="size-2 rounded-full bg-accent-soft" />
            Live · {handsDetected} hand{handsDetected === 1 ? "" : "s"} · {fps || "—"} FPS
          </div>
        ) : null}

        {!running ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/85 p-6 text-center text-bg">
            <CameraOff className="size-8 opacity-80" />
            <div>
              <p className="font-display text-xl">Camera recognition</p>
              <p className="mt-1 max-w-sm text-sm text-bg/70">Camera frames stay in this browser. The hand-tracker model is downloaded when you first start recognition.</p>
            </div>
            <Button onClick={start} disabled={loading}>
              {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}
              {loading ? "Starting…" : "Enable camera"}
            </Button>
            {error ? <p className="max-w-sm text-sm text-red-200">{error}</p> : null}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-ink px-3 py-2 text-xs text-bg/70">
        <span>{running ? "Two-hand tracking enabled" : "Camera off"}</span>
        {running ? (
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={stop}>
              <Square className="size-3.5" /> Stop
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => { stop(); void start(); }}>
              <RotateCcw className="size-3.5" /> Restart
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
