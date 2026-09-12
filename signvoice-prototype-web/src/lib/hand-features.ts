import type { FingerMask, PalmFacing, SignHeight, SignMotion } from "./signs";

export type Landmark = { x: number; y: number; z: number };

export type HandFeatures = {
  fingers: FingerMask;
  palm: PalmFacing;
  height: SignHeight;
  motion: SignMotion;
  handedness: "Left" | "Right" | "Unknown";
  wrist: Landmark;
};

function dist(a: Landmark, b: Landmark) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.hypot(dx, dy, dz);
}

function extended(tip: Landmark, pip: Landmark, wrist: Landmark) {
  return dist(tip, wrist) > dist(pip, wrist) * 1.08;
}

function thumbExtended(landmarks: Landmark[], isRight: boolean) {
  const wrist = landmarks[0];
  const mcp = landmarks[2];
  const tip = landmarks[4];
  const lateral = isRight ? tip.x > mcp.x + 0.03 : tip.x < mcp.x - 0.03;
  const long = dist(tip, wrist) > dist(mcp, wrist) * 1.05;
  return lateral || long;
}

export function featuresFromLandmarks(
  landmarks: Landmark[],
  handednessLabel: string,
  prevWrist: Landmark | null,
): HandFeatures {
  const wrist = landmarks[0];
  const isRight = handednessLabel.toLowerCase().startsWith("r");

  const fingers: FingerMask = {
    thumb: thumbExtended(landmarks, isRight),
    index: extended(landmarks[8], landmarks[6], wrist),
    middle: extended(landmarks[12], landmarks[10], wrist),
    ring: extended(landmarks[16], landmarks[14], wrist),
    pinky: extended(landmarks[20], landmarks[18], wrist),
  };

  const middleMcp = landmarks[9];
  const indexMcp = landmarks[5];
  const pinkyMcp = landmarks[17];
  const palmDx = indexMcp.x - pinkyMcp.x;
  const palmDz = indexMcp.z - pinkyMcp.z;
  const palmUp = wrist.y > middleMcp.y + 0.04;
  let palm: PalmFacing = "out";
  if (palmUp) palm = "up";
  else if (Math.abs(palmDx) < 0.04 && Math.abs(palmDz) > 0.02) palm = "side";
  else if (middleMcp.z > wrist.z + 0.03) palm = "in";
  else palm = "out";

  let height: SignHeight = "neutral";
  if (wrist.y < 0.38) height = "face";
  else if (wrist.y > 0.62) height = "chest";

  let motion: SignMotion = "none";
  if (prevWrist) {
    const dx = wrist.x - prevWrist.x;
    const dy = wrist.y - prevWrist.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (adx > 0.018 && adx > ady * 1.2) motion = "wave";
    else if (ady > 0.018 && ady > adx * 1.2) motion = dy < 0 ? "lift" : "nod";
    else if (adx > 0.012 && ady > 0.012) motion = "circle";
    if (height === "face" && dy < -0.01) motion = "to-mouth";
    if (dx < -0.02 && height === "face") motion = "forward";
  }

  const handedness: HandFeatures["handedness"] = isRight
    ? "Right"
    : handednessLabel.toLowerCase().startsWith("l")
      ? "Left"
      : "Unknown";

  return { fingers, palm, height, motion, handedness, wrist };
}

export function fingerHamming(a: FingerMask, b: FingerMask) {
  const keys: (keyof FingerMask)[] = ["thumb", "index", "middle", "ring", "pinky"];
  return keys.reduce((n, k) => n + (a[k] === b[k] ? 0 : 1), 0);
}
