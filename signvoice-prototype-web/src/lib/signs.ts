export type FingerName = "thumb" | "index" | "middle" | "ring" | "pinky";

export type FingerMask = Record<FingerName, boolean>;

export type SignMotion =
  | "none"
  | "wave"
  | "nod"
  | "shake"
  | "circle"
  | "forward"
  | "to-mouth"
  | "lift"
  | "beckon";

export type PalmFacing = "out" | "in" | "side" | "up";
export type SignHeight = "face" | "chest" | "neutral";
export type SignCategory = "greet" | "number" | "need" | "ask";

export type Sign = {
  id: string;
  gloss: string;
  spoken: string;
  hindi: string;
  category: SignCategory;
  aliases: string[];
  howTo: string;
  note?: string;
  fingers: FingerMask;
  palm: PalmFacing;
  height: SignHeight;
  motion: SignMotion;
  twoHands?: boolean;
};

const F = (thumb: boolean, index: boolean, middle: boolean, ring: boolean, pinky: boolean): FingerMask => ({
  thumb,
  index,
  middle,
  ring,
  pinky,
});

export const SIGNS: Sign[] = [
  {
    id: "hello",
    gloss: "HELLO",
    spoken: "Hello",
    hindi: "Namaste",
    category: "greet",
    aliases: ["hi", "hey", "namaste", "namaskar"],
    howTo: "Raise an open palm facing out at head height and wave side to side.",
    fingers: F(true, true, true, true, true),
    palm: "out",
    height: "face",
    motion: "wave",
  },
  {
    id: "thank-you",
    gloss: "THANK-YOU",
    spoken: "Thank you",
    hindi: "Dhanyavaad",
    category: "greet",
    aliases: ["thanks", "shukriya", "dhanyavad", "dhanyavaad"],
    howTo: "Flat hand, palm down, starts at the chin and moves forward.",
    fingers: F(true, true, true, true, true),
    palm: "in",
    height: "face",
    motion: "forward",
  },
  {
    id: "please",
    gloss: "PLEASE",
    spoken: "Please",
    hindi: "Kripya",
    category: "greet",
    aliases: ["kripya", "krpaya"],
    howTo: "Open palm on the chest, small circular motion.",
    fingers: F(true, true, true, true, true),
    palm: "in",
    height: "chest",
    motion: "circle",
  },
  {
    id: "sorry",
    gloss: "SORRY",
    spoken: "Sorry",
    hindi: "Maaf kijiye",
    category: "greet",
    aliases: ["apology", "maaf", "kshama"],
    howTo: "Closed fist on the chest, circular motion.",
    fingers: F(false, false, false, false, false),
    palm: "in",
    height: "chest",
    motion: "circle",
  },
  {
    id: "yes",
    gloss: "YES",
    spoken: "Yes",
    hindi: "Haan",
    category: "greet",
    aliases: ["haan", "ha", "ok", "okay"],
    howTo: "Closed fist nods up and down, like a head nod.",
    fingers: F(false, false, false, false, false),
    palm: "out",
    height: "neutral",
    motion: "nod",
  },
  {
    id: "no",
    gloss: "NO",
    spoken: "No",
    hindi: "Nahi",
    category: "greet",
    aliases: ["nahi", "na", "nope"],
    howTo: "Closed fist (or index finger) shakes side to side.",
    fingers: F(false, false, false, false, false),
    palm: "out",
    height: "neutral",
    motion: "shake",
  },
  {
    id: "zero",
    gloss: "ZERO",
    spoken: "Zero",
    hindi: "Shunya",
    category: "number",
    aliases: ["0", "shunya", "nothing"],
    howTo: "Thumb and index form an O. Other fingers folded.",
    fingers: F(true, true, false, false, false),
    palm: "out",
    height: "neutral",
    motion: "none",
  },
  {
    id: "one",
    gloss: "ONE",
    spoken: "One",
    hindi: "Ek",
    category: "number",
    aliases: ["1", "ek"],
    howTo: "Index finger up. Other fingers folded.",
    fingers: F(false, true, false, false, false),
    palm: "out",
    height: "neutral",
    motion: "none",
  },
  {
    id: "two",
    gloss: "TWO",
    spoken: "Two",
    hindi: "Do",
    category: "number",
    aliases: ["2", "do"],
    howTo: "Index and middle up.",
    fingers: F(false, true, true, false, false),
    palm: "out",
    height: "neutral",
    motion: "none",
  },
  {
    id: "three",
    gloss: "THREE",
    spoken: "Three",
    hindi: "Teen",
    category: "number",
    aliases: ["3", "teen"],
    howTo: "Index, middle, and ring up.",
    fingers: F(false, true, true, true, false),
    palm: "out",
    height: "neutral",
    motion: "none",
  },
  {
    id: "four",
    gloss: "FOUR",
    spoken: "Four",
    hindi: "Chaar",
    category: "number",
    aliases: ["4", "char", "chaar"],
    howTo: "Four fingers up, thumb tucked.",
    fingers: F(false, true, true, true, true),
    palm: "out",
    height: "neutral",
    motion: "none",
  },
  {
    id: "five",
    gloss: "FIVE",
    spoken: "Five",
    hindi: "Paanch",
    category: "number",
    aliases: ["5", "paanch", "panch"],
    howTo: "Open hand, all five fingers extended.",
    fingers: F(true, true, true, true, true),
    palm: "out",
    height: "neutral",
    motion: "none",
  },
  {
    id: "six",
    gloss: "SIX",
    spoken: "Six",
    hindi: "Chhah",
    category: "number",
    aliases: ["6", "chhe", "chhah"],
    howTo: "Thumb and pinky extended (others folded). Isolated classroom pose.",
    note: "Regional ISL number forms vary. This MVP uses a distinctive static pose.",
    fingers: F(true, false, false, false, true),
    palm: "out",
    height: "neutral",
    motion: "none",
  },
  {
    id: "seven",
    gloss: "SEVEN",
    spoken: "Seven",
    hindi: "Saat",
    category: "number",
    aliases: ["7", "saat"],
    howTo: "Thumb, index, and pinky extended.",
    note: "Regional ISL number forms vary.",
    fingers: F(true, true, false, false, true),
    palm: "out",
    height: "neutral",
    motion: "none",
  },
  {
    id: "eight",
    gloss: "EIGHT",
    spoken: "Eight",
    hindi: "Aath",
    category: "number",
    aliases: ["8", "aath", "aat"],
    howTo: "Thumb and index extended.",
    note: "Regional ISL number forms vary.",
    fingers: F(true, true, false, false, false),
    palm: "out",
    height: "neutral",
    motion: "none",
  },
  {
    id: "nine",
    gloss: "NINE",
    spoken: "Nine",
    hindi: "Nau",
    category: "number",
    aliases: ["9", "nau"],
    howTo: "Index finger hooked (slightly bent). Thumb tucked.",
    note: "Regional ISL number forms vary.",
    fingers: F(false, true, false, false, false),
    palm: "side",
    height: "neutral",
    motion: "none",
  },
  {
    id: "ten",
    gloss: "TEN",
    spoken: "Ten",
    hindi: "Das",
    category: "number",
    aliases: ["10", "das"],
    howTo: "Closed fist, small shake. Isolated classroom pose for ten.",
    note: "Some regions sign 10 as 1 then 0.",
    fingers: F(false, false, false, false, false),
    palm: "side",
    height: "neutral",
    motion: "shake",
  },
  {
    id: "water",
    gloss: "WATER",
    spoken: "Water",
    hindi: "Paani",
    category: "need",
    aliases: ["paani", "pani", "drink"],
    howTo: "C-shape (thumb + fingers curve) taps the mouth, as if drinking.",
    fingers: F(true, true, true, false, false),
    palm: "side",
    height: "face",
    motion: "to-mouth",
  },
  {
    id: "food",
    gloss: "FOOD",
    spoken: "Food",
    hindi: "Khaana",
    category: "need",
    aliases: ["eat", "khana", "khaana", "bhojan"],
    howTo: "Fingertips bunch and tap the mouth twice.",
    fingers: F(true, true, true, true, false),
    palm: "in",
    height: "face",
    motion: "to-mouth",
  },
  {
    id: "help",
    gloss: "HELP",
    spoken: "Help",
    hindi: "Madad",
    category: "need",
    aliases: ["madad", "sahayata", "assist"],
    howTo: "Closed fist rests on the open palm of the other hand, then both lift.",
    twoHands: true,
    fingers: F(false, false, false, false, false),
    palm: "up",
    height: "chest",
    motion: "lift",
  },
  {
    id: "toilet",
    gloss: "TOILET",
    spoken: "Toilet",
    hindi: "Shauchalay",
    category: "need",
    aliases: ["restroom", "bathroom", "washroom", "shauchalay"],
    howTo: "Index finger taps the side of the nose twice.",
    fingers: F(false, true, false, false, false),
    palm: "side",
    height: "face",
    motion: "none",
  },
  {
    id: "home",
    gloss: "HOME",
    spoken: "Home",
    hindi: "Ghar",
    category: "need",
    aliases: ["ghar", "house"],
    howTo: "Fingertips of both hands meet like a roof, then open slightly.",
    twoHands: true,
    fingers: F(true, true, true, true, true),
    palm: "in",
    height: "chest",
    motion: "none",
  },
  {
    id: "what",
    gloss: "WHAT",
    spoken: "What",
    hindi: "Kya",
    category: "ask",
    aliases: ["kya"],
    howTo: "Both palms up at chest height, small side shake. In ISL, WHAT often comes last.",
    twoHands: true,
    fingers: F(true, true, true, true, true),
    palm: "up",
    height: "chest",
    motion: "shake",
  },
  {
    id: "where",
    gloss: "WHERE",
    spoken: "Where",
    hindi: "Kahaan",
    category: "ask",
    aliases: ["kahan", "kahaan"],
    howTo: "Index finger points and traces a small circle in space.",
    fingers: F(false, true, false, false, false),
    palm: "out",
    height: "neutral",
    motion: "circle",
  },
  {
    id: "name",
    gloss: "NAME",
    spoken: "Name",
    hindi: "Naam",
    category: "ask",
    aliases: ["naam"],
    howTo: "Two fingers of the dominant hand tap two fingers of the other hand.",
    twoHands: true,
    fingers: F(false, true, true, false, false),
    palm: "in",
    height: "chest",
    motion: "none",
  },
  {
    id: "good",
    gloss: "GOOD",
    spoken: "Good",
    hindi: "Achha",
    category: "ask",
    aliases: ["achha", "accha", "theek", "great"],
    howTo: "Thumbs up, fist otherwise closed, palm facing sideways.",
    fingers: F(true, false, false, false, false),
    palm: "side",
    height: "neutral",
    motion: "none",
  },
  {
    id: "bad",
    gloss: "BAD",
    spoken: "Bad",
    hindi: "Bura",
    category: "ask",
    aliases: ["bura", "kharab"],
    howTo: "Thumbs down. Fist otherwise closed.",
    fingers: F(true, false, false, false, false),
    palm: "side",
    height: "neutral",
    motion: "nod",
  },
  {
    id: "understand",
    gloss: "UNDERSTAND",
    spoken: "Understand",
    hindi: "Samajh",
    category: "ask",
    aliases: ["samajh", "got it"],
    howTo: "Fist at the forehead opens into a flat hand pushing slightly forward.",
    fingers: F(false, false, false, false, false),
    palm: "in",
    height: "face",
    motion: "forward",
  },
  {
    id: "stop",
    gloss: "STOP",
    spoken: "Stop",
    hindi: "Ruko",
    category: "ask",
    aliases: ["ruko", "ruk", "halt", "wait"],
    howTo: "Open palm faces the other person, held still like a halt sign.",
    fingers: F(true, true, true, true, true),
    palm: "out",
    height: "chest",
    motion: "none",
  },
  {
    id: "come",
    gloss: "COME",
    spoken: "Come",
    hindi: "Aao",
    category: "ask",
    aliases: ["aao", "aao na", "come here"],
    howTo: "Open hand, palm up, fingers curl toward yourself twice.",
    fingers: F(true, true, true, true, true),
    palm: "up",
    height: "chest",
    motion: "beckon",
  },
];

export const CATEGORIES: { id: SignCategory; label: string }[] = [
  { id: "greet", label: "Greetings" },
  { id: "number", label: "Numbers" },
  { id: "need", label: "Needs" },
  { id: "ask", label: "Ask & act" },
];

export function getSign(id: string) {
  return SIGNS.find((s) => s.id === id);
}

export function searchSigns(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return SIGNS;
  return SIGNS.filter((s) => {
    const hay = [s.gloss, s.spoken, s.hindi, s.id, ...s.aliases].join(" ").toLowerCase();
    return hay.includes(q);
  });
}

function normalizeTranscript(transcript: string) {
  return transcript
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function signKeys(sign: Sign) {
  return [sign.spoken, sign.hindi, sign.gloss, sign.id, ...sign.aliases]
    .map((key) => normalizeTranscript(key))
    .filter(Boolean);
}

export function matchSpokenToSigns(transcript: string) {
  const text = normalizeTranscript(transcript);
  if (!text) return { matches: [] as Sign[], unmatched: [] as string[] };

  const tokens = text.split(" ");
  const matches: Sign[] = [];
  const unmatched: string[] = [];

  for (let index = 0; index < tokens.length; ) {
    let found: Sign | undefined;
    let consumed = 0;

    for (let length = Math.min(3, tokens.length - index); length >= 1; length -= 1) {
      const phrase = tokens.slice(index, index + length).join(" ");
      found = SIGNS.find((sign) => signKeys(sign).includes(phrase));
      if (found) {
        consumed = length;
        break;
      }
    }

    if (found) {
      matches.push(found);
      index += consumed;
    } else {
      unmatched.push(tokens[index]);
      index += 1;
    }
  }

  return { matches, unmatched };
}

export function matchSpokenToSign(transcript: string): Sign | undefined {
  return matchSpokenToSigns(transcript).matches[0];
}
