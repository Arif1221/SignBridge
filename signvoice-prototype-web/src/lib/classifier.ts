import { SIGNS, type Sign } from "./signs";
import { fingerHamming, type HandFeatures } from "./hand-features";

export type Prediction = {
  sign: Sign;
  confidence: number;
  reason: string;
};

const MOTION_COMPAT: Record<string, string[]> = {
  none: ["none"],
  wave: ["wave", "shake", "none"],
  nod: ["nod", "lift", "none"],
  shake: ["shake", "wave", "none"],
  circle: ["circle", "wave", "none"],
  forward: ["forward", "none"],
  "to-mouth": ["to-mouth", "forward", "none"],
  lift: ["lift", "nod", "none"],
  beckon: ["beckon", "wave", "none"],
};

function scoreSign(sign: Sign, feat: HandFeatures): number {
  const ham = fingerHamming(sign.fingers, feat.fingers);
  const fingerScore = 1 - ham / 5;
  let score = fingerScore * 0.58;

  if (sign.palm === feat.palm) score += 0.18;
  else score -= 0.12;

  if (sign.height === feat.height) score += 0.08;
  else score -= 0.06;

  if (sign.motion === feat.motion) score += sign.motion === "none" ? 0.10 : 0.16;
  else if (sign.motion === "none" && feat.motion !== "none") score -= 0.12;
  else score -= 0.10;

  if (sign.twoHands) score += 0.08;

  return Math.max(0, Math.min(1, score));
}

export function classify(features: HandFeatures | HandFeatures[]): Prediction | null {
  const hands = Array.isArray(features) ? features : [features];
  if (!hands.length) return null;

  const ranked = SIGNS.map((sign) => {
    const candidates = hands.map((feat) => scoreSign(sign, feat)).sort((a, b) => b - a);
    const bestSingleHand = candidates[0] ?? 0;
    const baseConfidence = sign.twoHands
      ? hands.length >= 2
        ? ((candidates[0] ?? 0) + (candidates[1] ?? 0)) / 2
        : bestSingleHand * 0.65
      : bestSingleHand;
    const twoHandAdjustment = sign.twoHands ? 0.12 : 0;
    const confidence = Math.max(0, Math.min(1, baseConfidence + twoHandAdjustment));
    const bestFeature = hands.reduce((best, feat) =>
      scoreSign(sign, feat) > scoreSign(sign, best) ? feat : best,
    );

    return {
      sign,
      confidence,
      reason: `${fingerHamming(sign.fingers, bestFeature.fingers)} finger mismatch${sign.twoHands ? ` · ${hands.length >= 2 ? "two hands" : "needs two hands"}` : ""}`,
    };
  }).sort((a, b) => b.confidence - a.confidence);

  const top = ranked[0];
  if (!top || top.confidence < 0.68) return null;
  if (ranked[1] && top.confidence - ranked[1].confidence < 0.12) {
    return null;
  }
  return top;
}

export class Smoother {
  private window: Prediction[] = [];
  private lastSpokenId: string | null = null;
  private lastSpokenAt = 0;

  constructor(private size = 8) {}

  push(p: Prediction | null, now = Date.now()) {
    if (p) this.window.push(p);
    if (this.window.length > this.size) this.window.shift();
    if (!p && this.window.length) this.window.shift();

    if (this.window.length < 4) return null;

    const counts = new Map<string, { n: number; sum: number; pred: Prediction }>();
    for (const item of this.window) {
      const cur = counts.get(item.sign.id) ?? { n: 0, sum: 0, pred: item };
      cur.n += 1;
      cur.sum += item.confidence;
      cur.pred = item;
      counts.set(item.sign.id, cur);
    }
    let best: { n: number; sum: number; pred: Prediction } | null = null;
    for (const v of counts.values()) {
      if (!best || v.n > best.n || (v.n === best.n && v.sum > best.sum)) best = v;
    }
    if (!best || best.n < 4) return null;
    const conf = best.sum / best.n;
    if (conf < 0.70) return null;
    if (best.pred.sign.id === this.lastSpokenId && now - this.lastSpokenAt < 2200) return null;
    this.lastSpokenId = best.pred.sign.id;
    this.lastSpokenAt = now;
    this.window = [];
    return { ...best.pred, confidence: conf };
  }

  reset() {
    this.window = [];
    this.lastSpokenId = null;
  }
}
