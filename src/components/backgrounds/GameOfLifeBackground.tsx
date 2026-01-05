import { useEffect, useRef } from 'react'
import { COLOR_VALUES, type ColorScheme } from '../../lib/types'

interface GameOfLifeBackgroundProps {
  width: number
  height: number
  colorScheme: ColorScheme
  className?: string
}

const CELL_SIZE = 8

export function GameOfLifeBackground({ width, height, colorScheme, className }: GameOfLifeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<boolean[][]>([])
  const frameCountRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cols = Math.ceil(width / CELL_SIZE)
    const rows = Math.ceil(height / CELL_SIZE)

    // Initialize grid
    gridRef.current = initGameOfLifeGrid(cols, rows)

    let animationId: number

    const animate = () => {
      frameCountRef.current++

      // Update every 5 frames for slower evolution
      if (frameCountRef.current % 5 === 0) {
        gridRef.current = updateGameOfLife(gridRef.current, cols, rows)
      }

      renderGameOfLifeBackground(ctx, width, height, colorScheme, gridRef.current, CELL_SIZE)
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

export function initGameOfLifeGrid(cols: number, rows: number): boolean[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() < 0.15)
  )
}

export function updateGameOfLife(grid: boolean[][], cols: number, rows: number): boolean[][] {
  const newGrid: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  )

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(grid, x, y, cols, rows)
      const alive = grid[y][x]

      if (alive && (neighbors === 2 || neighbors === 3)) {
        newGrid[y][x] = true
      } else if (!alive && neighbors === 3) {
        newGrid[y][x] = true
      }
    }
  }

  // Occasionally add random cells to prevent extinction
  if (Math.random() < 0.05) {
    const x = Math.floor(Math.random() * cols)
    const y = Math.floor(Math.random() * rows)
    // Add a glider pattern
    if (x > 2 && y > 2 && x < cols - 2 && y < rows - 2) {
      newGrid[y][x] = true
      newGrid[y + 1][x + 1] = true
      newGrid[y + 2][x - 1] = true
      newGrid[y + 2][x] = true
      newGrid[y + 2][x + 1] = true
    }
  }

  return newGrid
}

function countNeighbors(grid: boolean[][], x: number, y: number, cols: number, rows: number): number {
  let count = 0

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue

      const nx = (x + dx + cols) % cols
      const ny = (y + dy + rows) % rows

      if (grid[ny][nx]) count++
    }
  }

  return count
}

export function renderGameOfLifeBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colorScheme: ColorScheme,
  grid: boolean[][],
  cellSize: number
) {
  const colors = COLOR_VALUES[colorScheme]

  // Dark background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, width, height)

  // Draw cells
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x]) {
        const px = x * cellSize
        const py = y * cellSize

        // Glow effect
        ctx.shadowColor = colors.primary
        ctx.shadowBlur = 4

        ctx.fillStyle = colors.primary
        ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2)
      }
    }
  }

  ctx.shadowBlur = 0

  // Draw subtle grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
  ctx.lineWidth = 0.5

  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}
