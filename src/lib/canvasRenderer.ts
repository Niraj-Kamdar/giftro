import { type FontConfig, type FrameState, FONT_FAMILIES, hexToGlow } from './types'
import { type BackgroundState, renderBackground } from './backgroundRenderer'

const PADDING = 40
const CURSOR_WIDTH = 2

export interface RenderOptions {
  width: number
  height: number
  font: FontConfig
  backgroundColor: string // hex color for background animation
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  frameState: FrameState,
  backgroundState: BackgroundState | null,
  options: RenderOptions
) {
  const { width, height, font, backgroundColor } = options

  // Render background
  if (backgroundState) {
    renderBackground(ctx, backgroundState, width, height, backgroundColor)
  } else {
    // Fallback plain background
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)
  }

  // Build font string - only include bold/italic when enabled
  const fontFamily = FONT_FAMILIES[font.family]
  const fontParts: string[] = []
  if (font.italic) fontParts.push('italic')
  if (font.bold) fontParts.push('bold')
  fontParts.push(`${font.size}px`)
  fontParts.push(fontFamily)
  ctx.font = fontParts.join(' ')
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'

  const text = frameState.text
  const textWidth = ctx.measureText(text).width
  const cursorX = PADDING + textWidth

  // Center text vertically
  const textY = height / 2

  // Draw blur backdrop behind text for readability
  const backdropPadding = 12
  const backdropHeight = font.size + backdropPadding * 2
  const backdropY = textY - backdropHeight / 2
  const backdropWidth = Math.min(
    textWidth + backdropPadding * 2 + PADDING,
    width - PADDING + backdropPadding
  )

  // Rounded rectangle backdrop with frosted glass effect
  ctx.save()
  const radius = 8
  ctx.beginPath()
  ctx.roundRect(
    PADDING - backdropPadding,
    backdropY,
    Math.max(backdropWidth, width * 0.4),
    backdropHeight,
    radius
  )
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.fill()

  // Add subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()

  // Draw text with glow effect
  const glowColor = hexToGlow(font.color, 0.5)
  ctx.shadowColor = glowColor
  ctx.shadowBlur = 8
  ctx.fillStyle = font.color
  ctx.fillText(text, PADDING, textY)

  // Reset shadow for cursor
  ctx.shadowBlur = 0

  // Draw cursor
  if (frameState.cursorVisible) {
    ctx.fillStyle = backgroundColor
    ctx.shadowColor = backgroundColor
    ctx.shadowBlur = 4
    ctx.fillRect(
      cursorX + 4,
      textY - font.size * 0.5,
      CURSOR_WIDTH,
      font.size
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
  const { width, height, font, backgroundColor } = options
  const fontFamily = FONT_FAMILIES[font.family]

  // Clear
  ctx.clearRect(0, 0, width, height)

  // Build font string - only include bold/italic when enabled
  const fontParts: string[] = []
  if (font.italic) fontParts.push('italic')
  if (font.bold) fontParts.push('bold')
  fontParts.push(`${font.size}px`)
  fontParts.push(fontFamily)
  ctx.font = fontParts.join(' ')
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'

  const textWidth = ctx.measureText(text).width
  const cursorX = PADDING + textWidth
  const textY = height / 2

  // Draw text
  ctx.fillStyle = font.color
  ctx.fillText(text, PADDING, textY)

  // Draw cursor
  if (cursorVisible) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(
      cursorX + 4,
      textY - font.size * 0.5,
      CURSOR_WIDTH,
      font.size
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
