import { useEffect, useRef } from 'react'
import { COLOR_VALUES, type ColorScheme } from '../../lib/types'

interface PlainBackgroundProps {
  width: number
  height: number
  colorScheme: ColorScheme
  className?: string
}

export function PlainBackground({ width, height, colorScheme, className }: PlainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    renderPlainBackground(ctx, width, height, colorScheme)
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

export function renderPlainBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colorScheme: ColorScheme
) {
  const colors = COLOR_VALUES[colorScheme]

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#0a0a0a')
  gradient.addColorStop(0.5, '#111111')
  gradient.addColorStop(1, '#0a0a0a')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Add subtle glow in corner
  const glowGradient = ctx.createRadialGradient(
    width * 0.8, height * 0.2, 0,
    width * 0.8, height * 0.2, width * 0.5
  )
  glowGradient.addColorStop(0, colors.glow)
  glowGradient.addColorStop(1, 'transparent')

  ctx.fillStyle = glowGradient
  ctx.fillRect(0, 0, width, height)
}
