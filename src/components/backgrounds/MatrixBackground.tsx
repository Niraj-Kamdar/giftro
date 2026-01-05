import { useEffect, useRef } from 'react'
import { COLOR_VALUES, type ColorScheme } from '../../lib/types'

interface MatrixColumn {
  x: number
  y: number
  speed: number
  chars: string[]
  length: number
}

interface MatrixBackgroundProps {
  width: number
  height: number
  colorScheme: ColorScheme
  className?: string
}

const CHAR_SIZE = 14
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789'

export function MatrixBackground({ width, height, colorScheme, className }: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const columnsRef = useRef<MatrixColumn[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize columns
    columnsRef.current = initMatrixColumns(width, height)

    let animationId: number

    const animate = () => {
      updateMatrixColumns(columnsRef.current, height)
      renderMatrixBackground(ctx, width, height, colorScheme, columnsRef.current)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [width, height, colorScheme])

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
    x: i * CHAR_SIZE,
    y: Math.random() * height - height,
    speed: Math.random() * 2 + 1,
    chars: Array.from({ length: Math.floor(height / CHAR_SIZE) + 5 }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    ),
    length: Math.floor(Math.random() * 10) + 5,
  }))
}

export function updateMatrixColumns(columns: MatrixColumn[], height: number) {
  for (const col of columns) {
    col.y += col.speed

    // Reset when off screen
    if (col.y > height + col.length * CHAR_SIZE) {
      col.y = -col.length * CHAR_SIZE
      col.speed = Math.random() * 2 + 1
      col.length = Math.floor(Math.random() * 10) + 5
    }

    // Randomly change characters
    if (Math.random() < 0.02) {
      const idx = Math.floor(Math.random() * col.chars.length)
      col.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)]
    }
  }
}

export function renderMatrixBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colorScheme: ColorScheme,
  columns: MatrixColumn[]
) {
  const colors = COLOR_VALUES[colorScheme]

  // Fade effect
  ctx.fillStyle = 'rgba(10, 10, 10, 0.1)'
  ctx.fillRect(0, 0, width, height)

  ctx.font = `${CHAR_SIZE}px monospace`

  for (const col of columns) {
    for (let i = 0; i < col.length; i++) {
      const charY = col.y + i * CHAR_SIZE
      if (charY < -CHAR_SIZE || charY > height + CHAR_SIZE) continue

      const charIdx = Math.floor(charY / CHAR_SIZE) % col.chars.length
      const char = col.chars[Math.abs(charIdx)]

      // Head character is brighter
      if (i === col.length - 1) {
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = colors.primary
        ctx.shadowBlur = 10
      } else {
        const fade = 1 - i / col.length
        ctx.fillStyle = `${colors.primary}${Math.floor(fade * 200).toString(16).padStart(2, '0')}`
        ctx.shadowBlur = 0
      }

      ctx.fillText(char, col.x, charY)
    }
  }

  ctx.shadowBlur = 0
}
