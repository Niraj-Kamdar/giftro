import GIF from 'gif.js'
import { generateAnimationSteps, calculateDurationMs, interpolateFrameAtTime } from './animationEngine'
import { renderFrame, createOffscreenCanvas } from './canvasRenderer'
import { createBackgroundState, updateBackgroundState } from './backgroundRenderer'
import { compressGif } from './gifCompressor'
import { type AnimationConfig } from './types'

export interface EncoderProgress {
  phase: 'rendering' | 'encoding' | 'compressing' | 'complete'
  progress: number // 0-100
  currentFrame?: number
  totalFrames?: number
  originalSize?: number
  compressedSize?: number
}

export interface GifResult {
  blob: Blob
  originalSize: number
  compressedSize: number
}

type ProgressCallback = (progress: EncoderProgress) => void

export async function generateGif(
  config: AnimationConfig,
  onProgress?: ProgressCallback
): Promise<GifResult> {
  const { width, height, color, type: backgroundType } = config.background
  const { fps, playbackSpeed, compression } = config.gif

  // Generate animation data
  const steps = generateAnimationSteps(config)
  const durationMs = calculateDurationMs(steps)

  // FPS determines frame count (quality/smoothness)
  const totalFrames = Math.ceil((durationMs / 1000) * fps)

  // Playback speed scales frame delays
  // At 1x: delay = 1000/fps (normal)
  // At 2x: delay = 500/fps (twice as fast)
  // At 0.5x: delay = 2000/fps (half speed)
  const baseDelay = 1000 / fps
  const frameDelay = Math.round(baseDelay / playbackSpeed)

  // Create offscreen canvas
  const { ctx } = createOffscreenCanvas(width, height)

  // Initialize GIF encoder
  const gif = new GIF({
    workers: 2,
    quality: 10, // Fixed quality - compression handles the rest
    width,
    height,
    workerScript: '/gif.worker.js',
  })

  // Initialize background state
  let backgroundState = createBackgroundState(backgroundType, width, height)

  // Progress distribution:
  // - Rendering: 0-35%
  // - Encoding: 35-60%
  // - Compressing: 60-95%
  // - Complete: 100%

  // Render phase (0-35%)
  for (let frame = 0; frame < totalFrames; frame++) {
    // Calculate time in animation for this frame
    const timeMs = (frame / fps) * 1000

    // Update background
    backgroundState = updateBackgroundState(backgroundState, width, height)

    // Get frame state at this time
    const frameState = interpolateFrameAtTime(steps, timeMs)

    // Render frame
    renderFrame(ctx, frameState, backgroundState, {
      width,
      height,
      font: config.font,
      backgroundColor: color,
    })

    // Add frame to GIF with playback-speed-adjusted delay
    gif.addFrame(ctx, { copy: true, delay: frameDelay })

    // Report progress (0-35%)
    onProgress?.({
      phase: 'rendering',
      progress: Math.round((frame / totalFrames) * 35),
      currentFrame: frame + 1,
      totalFrames,
    })
  }

  // Encoding phase (35-60%)
  const rawBlob = await new Promise<Blob>((resolve, reject) => {
    gif.on('progress', (p) => {
      onProgress?.({
        phase: 'encoding',
        progress: 35 + Math.round(p * 25), // 35-60%
      })
    })

    gif.on('finished', (blob) => {
      resolve(blob)
    })

    gif.on('error', (error) => {
      reject(error)
    })

    gif.render()
  })

  // Compression phase (60-95%)
  if (compression.enabled) {
    onProgress?.({
      phase: 'compressing',
      progress: 60,
    })

    try {
      const result = await compressGif(rawBlob, compression)

      onProgress?.({
        phase: 'complete',
        progress: 100,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
      })

      return {
        blob: result.blob,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
      }
    } catch (error) {
      // If compression fails, return the raw blob
      console.warn('Compression failed, using uncompressed GIF:', error)
      onProgress?.({
        phase: 'complete',
        progress: 100,
        originalSize: rawBlob.size,
        compressedSize: rawBlob.size,
      })

      return {
        blob: rawBlob,
        originalSize: rawBlob.size,
        compressedSize: rawBlob.size,
      }
    }
  }

  // No compression - return raw blob
  onProgress?.({
    phase: 'complete',
    progress: 100,
    originalSize: rawBlob.size,
    compressedSize: rawBlob.size,
  })

  return {
    blob: rawBlob,
    originalSize: rawBlob.size,
    compressedSize: rawBlob.size,
  }
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
