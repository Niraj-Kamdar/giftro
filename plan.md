# Plan: Developer Intro GIF Generator

## Overview
A single-page React app that creates animated typing-effect GIFs for GitHub READMEs, transforming a developer's name into their various web3/social handles.

---

## Animation Sequence Logic

Based on your example with "Niraj":

1. **Base typing**: `Hey there! I am Niraj` (type character by character)
2. **Transform to .sol**: 
   - Lowercase the 'N' → `niraj`
   - Prefix with `0xk` → `0xkniraj`
   - Append `.sol` → `0xkniraj.sol`
3. **Transform to Farcaster**:
   - Remove `.sol`
   - Append `.farcaster.eth` → `0xkniraj.farcaster.eth`
4. **Transform to Twitter**:
   - Remove `.farcaster.eth`
   - Prefix with `https://x.com/` → `https://x.com/0xkniraj`
5. **Loop back** (optional pause, then restart)

---

## Technical Architecture

### Stack
- **React + Vite** - fast dev experience
- **gif.js** - client-side GIF encoding (uses web workers)
- **HTML Canvas** - render each animation frame

### Core Components

```
src/
├── App.jsx                 # Main single-page layout
├── components/
│   ├── InputForm.jsx       # User details form
│   ├── AnimationPreview.jsx # Live canvas preview
│   └── GifControls.jsx     # Generate/download buttons
├── hooks/
│   └── useAnimationFrames.js # Generate frame sequence
├── lib/
│   ├── animationEngine.js  # Text transformation logic
│   ├── canvasRenderer.js   # Draw frames to canvas
│   └── gifEncoder.js       # gif.js wrapper
└── styles/
    └── index.css
```

### Data Flow

```
User Input → Generate Frame Sequence → Render to Canvas → Encode GIF → Download
```

---

## Implementation Steps

### Phase 1: Project Setup
1. Scaffold Vite + React project
2. Install dependencies: `gif.js`
3. Basic layout with form and preview area

### Phase 2: Animation Engine
1. Define transformation steps as a state machine:
   ```js
   const steps = [
     { action: 'type', target: 'Hey there! I am {name}' },
     { action: 'transform', from: '{name}', to: '0xk{name.lower}.sol' },
     { action: 'transform', to: '0xk{name.lower}.farcaster.eth' },
     { action: 'transform', to: 'https://x.com/0xk{name.lower}' },
   ];
   ```
2. Build interpolation logic for each transformation type:
   - **Type**: add one character per frame
   - **Delete**: remove characters from end
   - **Prepend/Append**: type at start/end

### Phase 3: Canvas Rendering
1. Create canvas with terminal/code aesthetic (dark bg, monospace font)
2. Implement cursor blink effect
3. Render current text state each frame
4. Add customization options (colors, font size, dimensions)

### Phase 4: GIF Generation
1. Initialize gif.js with web worker
2. Capture canvas frames at ~10-15 FPS
3. Add each frame with appropriate delay
4. Generate blob and trigger download

### Phase 5: Polish
1. Loading states during generation
2. Preview loop before committing to GIF
3. Responsive design
4. Error handling for edge cases

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| GIF library | gif.js | Pure client-side, no server needed |
| Frame rate | 12 FPS | Balance between smoothness and file size |
| Canvas size | 600x200 default | Fits GitHub README well |
| Typing speed | 50ms/char | Readable but not slow |

---

## Customization Options (Nice to have)

- Background color / theme presets
- Font selection
- Animation speed
- GIF dimensions
- Loop count

---

## Estimated File Sizes
- ~200KB for a 5-second looping GIF (depends on colors/complexity)
