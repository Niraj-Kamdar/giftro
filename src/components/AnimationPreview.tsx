import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAnimationFrames } from '../hooks/useAnimationFrames'
import { renderFrame } from '../lib/canvasRenderer'
import { createBackgroundState, updateBackgroundState, type BackgroundState } from '../lib/backgroundRenderer'
import { type AnimationConfig } from '../lib/types'

interface AnimationPreviewProps {
  config: AnimationConfig
}

export function AnimationPreview({ config }: AnimationPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const backgroundStateRef = useRef<BackgroundState | null>(null)

  const {
    currentFrame,
    totalFrames,
    durationMs,
    frameState,
    isPlaying,
    play,
    pause,
    restart,
  } = useAnimationFrames(config)

  // Initialize background state
  useEffect(() => {
    backgroundStateRef.current = createBackgroundState(
      config.background.type,
      config.background.width,
      config.background.height
    )
  }, [config.background.type, config.background.width, config.background.height])

  // Render frame
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Reset canvas context state to avoid corruption
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Update background state
    if (backgroundStateRef.current) {
      backgroundStateRef.current = updateBackgroundState(
        backgroundStateRef.current,
        config.background.width,
        config.background.height
      )
    }

    // Render
    renderFrame(ctx, frameState, backgroundStateRef.current, {
      width: config.background.width,
      height: config.background.height,
      font: config.font,
      backgroundColor: config.background.color,
    })
  }, [frameState, config.background, config.font])

  const progress = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0
  const durationSeconds = (durationMs / 1000).toFixed(1)

  return (
    <div className="space-y-4">
      {/* Canvas Preview */}
      <div className="relative rounded-lg overflow-hidden border border-white/10">
        <canvas
          ref={canvasRef}
          width={config.background.width}
          height={config.background.height}
          className="w-full"
          style={{ aspectRatio: `${config.background.width}/${config.background.height}` }}
        />
      </div>

      {/* Progress Bar */}
      <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-lavender-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? pause : play}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={restart}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            title="Restart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/50">
          <span>
            Frame {currentFrame + 1} / {totalFrames}
          </span>
          <span>|</span>
          <span>{durationSeconds}s</span>
        </div>
      </div>
    </div>
  )
}
