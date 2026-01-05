import { useEffect, useRef } from 'react'

interface MatrixColumn {
  x: number
  y: number
  speed: number
  chars: string[]
  length: number
  opacity: number
}

interface MatrixBackgroundProps {
  width: number
  height: number
  color: string // hex color
  className?: string
}

const CHAR_SIZE = 12
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01'

export function MatrixBackground({ width, height, color, className }: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const columnsRef = useRef<MatrixColumn[]>([])
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create background buffer for fade effect
    bgCanvasRef.current = document.createElement('canvas')
    bgCanvasRef.current.width = width
    bgCanvasRef.current.height = height

    // Initialize columns
    columnsRef.current = initMatrixColumns(width, height)

    let animationId: number

    const animate = () => {
      updateMatrixColumns(columnsRef.current, height)
      renderMatrixBackground(ctx, width, height, color, columnsRef.current)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [width, height, color])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
    />
  )
}

export function initMatrixColumns(width: number, height: number): MatrixColumn[] {
  const columnCount = Math.floor(width / CHAR_SIZE)
  return Array.from({ length: columnCount }, (_, i) => ({
    x: i * CHAR_SIZE + CHAR_SIZE / 2,
    y: Math.random() * height * 2 - height,
    speed: Math.random() * 3 + 2,
    chars: Array.from({ length: Math.floor(height / CHAR_SIZE) + 10 }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    ),
    length: Math.floor(Math.random() * 15) + 8,
    opacity: Math.random() * 0.5 + 0.5,
  }))
}

export function updateMatrixColumns(columns: MatrixColumn[], height: number) {
  for (const col of columns) {
    col.y += col.speed

    // Reset when off screen
    if (col.y - col.length * CHAR_SIZE > height) {
      col.y = -col.length * CHAR_SIZE
      col.speed = Math.random() * 3 + 2
      col.length = Math.floor(Math.random() * 15) + 8
      col.opacity = Math.random() * 0.5 + 0.5
    }

    // Randomly change characters for shimmer effect
    if (Math.random() < 0.05) {
      const idx = Math.floor(Math.random() * col.chars.length)
      col.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)]
    }
  }
}

export function renderMatrixBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  columns: MatrixColumn[]
) {
  // Clear with solid dark background (no trail effect that causes artifacts)
  ctx.fillStyle = '#050505'
  ctx.fillRect(0, 0, width, height)

  ctx.font = `bold ${CHAR_SIZE}px monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (const col of columns) {
    for (let i = 0; i < col.length; i++) {
      const charY = col.y - i * CHAR_SIZE

      // Skip if outside viewport
      if (charY < -CHAR_SIZE || charY > height + CHAR_SIZE) continue

      const charIdx = Math.abs(Math.floor((col.y - charY) / CHAR_SIZE)) % col.chars.length
      const char = col.chars[charIdx]

      // Calculate fade based on position in trail
      const fade = 1 - i / col.length
      const alpha = Math.floor(fade * col.opacity * 255)

      if (i === 0) {
        // Head character - brightest with glow
        ctx.shadowColor = color
        ctx.shadowBlur = 8
        ctx.fillStyle = '#ffffff'
      } else if (i === 1) {
        // Second char - bright colored
        ctx.shadowColor = color
        ctx.shadowBlur = 4
        ctx.fillStyle = color
      } else {
        // Trail - fading color
        ctx.shadowBlur = 0
        ctx.fillStyle = `${color}${alpha.toString(16).padStart(2, '0')}`
      }

      ctx.fillText(char, col.x, charY)
    }
  }

  ctx.shadowBlur = 0
}
