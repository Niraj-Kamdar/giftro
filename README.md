# GIF Intro Generator

Create animated typing-effect GIFs for your GitHub README. Transform your name into web3/social handles with a terminal-style animation.

## Features

- Customizable intro text and name
- Multiple background animations (Particles, Matrix, Game of Life, Plain)
- 5 color themes (Lavender, Pink, Banana, Sky, Aqua)
- Configurable typing speed
- Support for .sol, .farcaster.eth, and x.com handles
- Live preview before generating
- Client-side GIF encoding (no server required)

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- gif.js

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Run tests
bun test

# Build for production
bun run build
```

## Usage

1. Enter your intro text and name
2. Configure username prefix and select handles
3. Choose a background animation and color theme
4. Adjust typing speed
5. Preview the animation
6. Click "Generate GIF" to download
