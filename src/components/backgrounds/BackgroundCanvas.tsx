import { type BackgroundType, type ColorScheme } from '../../lib/types'
import { ParticleBackground } from './ParticleBackground'
import { MatrixBackground } from './MatrixBackground'
import { GameOfLifeBackground } from './GameOfLifeBackground'
import { PlainBackground } from './PlainBackground'

interface BackgroundCanvasProps {
  type: BackgroundType
  colorScheme: ColorScheme
  width: number
  height: number
  className?: string
}

export function BackgroundCanvas({
  type,
  colorScheme,
  width,
  height,
  className,
}: BackgroundCanvasProps) {
  const props = { width, height, colorScheme, className }

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
