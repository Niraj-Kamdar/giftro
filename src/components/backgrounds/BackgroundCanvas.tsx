import { type BackgroundType } from '../../lib/types'
import { ParticleBackground } from './ParticleBackground'
import { MatrixBackground } from './MatrixBackground'
import { GameOfLifeBackground } from './GameOfLifeBackground'
import { PlainBackground } from './PlainBackground'

interface BackgroundCanvasProps {
  type: BackgroundType
  color: string // hex color
  width: number
  height: number
  className?: string
}

export function BackgroundCanvas({
  type,
  color,
  width,
  height,
  className,
}: BackgroundCanvasProps) {
  const props = { width, height, color, className }

  switch (type) {
    case 'particle':
      return <ParticleBackground {...props} />
    case 'matrix':
      return <MatrixBackground {...props} />
    case 'gameoflife':
      return <GameOfLifeBackground {...props} />
    case 'plain':
    default:
      return <PlainBackground {...props} />
  }
}
