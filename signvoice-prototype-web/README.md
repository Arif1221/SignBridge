# SignBridge

SignBridge is a browser-based prototype for recognizing a focused vocabulary of 30 Indian Sign Language (ISL) signs and presenting them as speech. It also provides a reverse voice-to-sign dictionary view.

## Current scope

- 30 isolated signs
- One- and two-hand camera tracking
- MediaPipe hand landmarks
- Browser-side heuristic recognition
- Confidence filtering and temporal smoothing
- Text-to-speech output
- Speech or text input for the reverse dictionary flow
- Sign illustrations and a searchable vocabulary

This is an isolated-sign recognition prototype, not a continuous ISL translation system.

## Run locally

```bash
npm install
npm run dev
```

Open the local address shown by Vite and allow camera/microphone access when prompted.

## Project structure

```text
src/
├── components/       UI and camera components
├── lib/              Sign data, feature extraction, recognition and speech helpers
└── routes/           Home, recognition, voice-to-sign and learning screens
```

## Recognition pipeline

```text
Camera
  ↓
MediaPipe hand landmarks
  ↓
Normalized hand features
  ↓
Rule-based recognizer
  ↓
Confidence + temporal smoothing
  ↓
Sign label
  ↓
Speech synthesis
```

The heuristic recognizer is intentionally kept separate from the UI so it can later be replaced with a trained model without redesigning the application.

## Next ML step

The next major upgrade is a trained landmark-based classifier evaluated on multiple signers. The Android version can then reuse the same feature/model design with CameraX and on-device inference.
