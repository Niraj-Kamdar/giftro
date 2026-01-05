import GIF from 'gif.js'
import { generateAnimationSteps, calculateTotalFrames, interpolateFrame } from './animationEngine'
import { renderFrame, createOffscreenCanvas } from './canvasRenderer'
import { createBackgroundState, updateBackgroundState } from './backgroundRenderer'
import { type AnimationConfig } from './types'

const FPS = 12
const FRAME_DELAY = Math.round(1000 / FPS) // ~83ms per frame

interface EncoderProgress {
  phase: 'rendering' | 'encoding' | 'complete'
  progress: number // 0-100
  currentFrame?: number
  totalFrames?: number
}

type ProgressCallback = (progress: EncoderProgress) => void

export async function generateGif(
  config: AnimationConfig,
  onProgress?: ProgressCallback
): Promise<Blob> {
  const { width, height, colorScheme, type: backgroundType } = config.background

  // Generate animation data
  const steps = generateAnimationSteps(config)
  const totalFrames = calculateTotalFrames(steps, config.speed)

  // Create offscreen canvas
  const { ctx } = createOffscreenCanvas(width, height)

  // Initialize GIF encoder
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width,
    height,
    workerScript: '/gif.worker.js',
  })

  // Initialize background state
  let backgroundState = createBackgroundState(backgroundType, width, height)

  // Render phase
  for (let frame = 0; frame < totalFrames; frame++) {
    // Update background
    backgroundState = updateBackgroundState(backgroundState, width, height)

    // Get frame state
    const frameState = interpolateFrame(steps, frame, config.speed)

    // Render frame
    renderFrame(ctx, frameState, backgroundState, { width, height, colorScheme })

    // Add frame to GIF
    gif.addFrame(ctx, { copy: true, delay: FRAME_DELAY })

    // Report progress
    onProgress?.({
      phase: 'rendering',
      progress: Math.round((frame / totalFrames) * 50), // 0-50% for rendering
      currentFrame: frame + 1,
      totalFrames,
    })
  }

  // Encoding phase
  return new Promise((resolve, reject) => {
    gif.on('progress', (p) => {
      onProgress?.({
        phase: 'encoding',
        progress: 50 + Math.round(p * 50), // 50-100% for encoding
      })
    })

    gif.on('finished', (blob) => {
      onProgress?.({
        phase: 'complete',
        progress: 100,
      })
      resolve(blob)
    })

    gif.on('error', (error) => {
      reject(error)
    })

    gif.render()
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
