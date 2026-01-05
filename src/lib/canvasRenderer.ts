import { type ColorScheme, type FrameState, COLOR_VALUES } from './types'
import { type BackgroundState, renderBackground } from './backgroundRenderer'

const FONT_SIZE = 24
const PADDING = 40
const CURSOR_WIDTH = 2

export interface RenderOptions {
  width: number
  height: number
  colorScheme: ColorScheme
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  frameState: FrameState,
  backgroundState: BackgroundState | null,
  options: RenderOptions
) {
  const { width, height, colorScheme } = options
  const colors = COLOR_VALUES[colorScheme]

  // Render background
  if (backgroundState) {
    renderBackground(ctx, backgroundState, width, height, colorScheme)
  } else {
    // Fallback plain background
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)
  }

  // Add subtle overlay for text readability
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.fillRect(0, 0, width, height)

  // Setup text rendering
  ctx.font = `${FONT_SIZE}px 'JetBrains Mono', 'Fira Code', monospace`
  ctx.textBaseline = 'middle'

  const text = frameState.text
  const textWidth = ctx.measureText(text).width
  const cursorX = PADDING + textWidth

  // Center text vertically
  const textY = height / 2

  // Draw text with glow effect
  ctx.shadowColor = colors.glow
  ctx.shadowBlur = 8
  ctx.fillStyle = '#ffffff'
  ctx.fillText(text, PADDING, textY)

  // Reset shadow for cursor
  ctx.shadowBlur = 0

  // Draw cursor
  if (frameState.cursorVisible) {
    ctx.fillStyle = colors.primary
    ctx.shadowColor = colors.primary
    ctx.shadowBlur = 4
    ctx.fillRect(
      cursorX + 4,
      textY - FONT_SIZE * 0.5,
      CURSOR_WIDTH,
      FONT_SIZE
    )
    ctx.shadowBlur = 0
  }
}

export function renderTextOnly(
  ctx: CanvasRenderingContext2D,
  text: string,
  cursorVisible: boolean,
  options: RenderOptions
) {
  const { width, height, colorScheme } = options
  const colors = COLOR_VALUES[colorScheme]

  // Clear
  ctx.clearRect(0, 0, width, height)

  // Setup text
  ctx.font = `${FONT_SIZE}px 'JetBrains Mono', 'Fira Code', monospace`
  ctx.textBaseline = 'middle'

  const textWidth = ctx.measureText(text).width
  const cursorX = PADDING + textWidth
  const textY = height / 2

  // Draw text
  ctx.fillStyle = '#ffffff'
  ctx.fillText(text, PADDING, textY)

  // Draw cursor
  if (cursorVisible) {
    ctx.fillStyle = colors.primary
    ctx.fillRect(
      cursorX + 4,
      textY - FONT_SIZE * 0.5,
      CURSOR_WIDTH,
      FONT_SIZE
    )
  }
}

export function createOffscreenCanvas(width: number, height: number): {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
} {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to create canvas context')
  }

  return { canvas, ctx }
}
