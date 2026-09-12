import { cn } from "@/lib/utils";
import type { Sign } from "@/lib/signs";

function Finger({
  d,
  open,
  delay,
}: {
  d: string;
  open: boolean;
  delay: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={open ? 9 : 8}
      strokeLinecap="round"
      className={cn("origin-bottom transition-all duration-300", !open && "opacity-70")}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

export function SignIllustration({
  sign,
  className,
  animate = true,
}: {
  sign: Sign;
  className?: string;
  animate?: boolean;
}) {
  const f = sign.fingers;
  const motionClass =
    animate && sign.motion !== "none"
      ? {
          wave: "animate-[wave_1.4s_ease-in-out_infinite]",
          shake: "animate-[shake_1.1s_ease-in-out_infinite]",
          nod: "animate-[nod_1.2s_ease-in-out_infinite]",
          circle: "animate-[spinish_1.8s_ease-in-out_infinite]",
          forward: "animate-[fwd_1.6s_ease-in-out_infinite]",
          "to-mouth": "animate-[up_1.4s_ease-in-out_infinite]",
          lift: "animate-[up_1.4s_ease-in-out_infinite]",
          beckon: "animate-[beckon_1.2s_ease-in-out_infinite]",
          none: "",
        }[sign.motion]
      : "";

  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-accent-soft text-accent",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 160 180" className={cn("h-[86%] w-[86%]", motionClass)}>
        <style>{`
          @keyframes wave { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(10deg); } }
          @keyframes shake { 0%,100% { transform: translateX(-6px); } 50% { transform: translateX(6px); } }
          @keyframes nod { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
          @keyframes spinish { 0% { transform: rotate(-12deg); } 50% { transform: rotate(12deg); } 100% { transform: rotate(-12deg); } }
          @keyframes fwd { 0%,100% { transform: translateY(6px); } 50% { transform: translateY(-4px); } }
          @keyframes up { 0%,100% { transform: translateY(8px); } 50% { transform: translateY(-6px); } }
          @keyframes beckon { 0%,100% { transform: rotate(6deg); } 50% { transform: rotate(-10deg); } }
        `}</style>
        <g transform="translate(28,28)">
          <path
            d="M28 118c0 18 16 32 36 32s36-14 36-32V78H28v40z"
            fill="currentColor"
            opacity="0.18"
          />
          <path
            d="M30 78c0-10 8-18 18-22"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity={f.thumb ? 1 : 0.35}
          />
          <Finger d="M48 78 V 18" open={f.index} delay={0} />
          <Finger d="M62 78 V 12" open={f.middle} delay={40} />
          <Finger d="M76 78 V 18" open={f.ring} delay={80} />
          <Finger d="M90 78 V 28" open={f.pinky} delay={120} />
          <path
            d="M30 70c-14-2-22 10-18 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={f.thumb ? 10 : 8}
            strokeLinecap="round"
            opacity={f.thumb ? 1 : 0.4}
          />
        </g>
        {sign.twoHands ? (
          <g transform="translate(78,58) scale(0.62)" opacity="0.55">
            <path
              d="M30 78c0-10 8-18 18-22M48 78 V 22M62 78 V 16M76 78 V 22M90 78 V 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>
        ) : null}
      </svg>
      <span className="absolute bottom-2 right-3 font-display text-xs tracking-wide text-accent/70">
        {sign.palm} · {sign.height}
      </span>
    </div>
  );
}
