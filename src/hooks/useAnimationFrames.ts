import { useState, useEffect, useCallback, useRef } from 'react'
import { generateAnimationSteps, calculateDurationMs, interpolateFrameAtTime } from '../lib/animationEngine'
import { type AnimationConfig, type FrameState, type AnimationStep } from '../lib/types'

interface UseAnimationFramesReturn {
  currentFrame: number
  totalFrames: number
  durationMs: number
  frameState: FrameState
  isPlaying: boolean
  play: () => void
  pause: () => void
  restart: () => void
  setFrame: (frame: number) => void
}

// Preview uses a fixed FPS for smooth real-time playback
const PREVIEW_FPS = 15
const FRAME_DURATION = 1000 / PREVIEW_FPS

export function useAnimationFrames(config: AnimationConfig): UseAnimationFramesReturn {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [steps, setSteps] = useState<AnimationStep[]>([])
  const [durationMs, setDurationMs] = useState(0)
  const [totalFrames, setTotalFrames] = useState(0)
  const animationRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number>(0)

  // Update steps when config changes
  useEffect(() => {
    const newSteps = generateAnimationSteps(config)
    const newDurationMs = calculateDurationMs(newSteps)
    // Preview uses fixed FPS, calculate how many frames that gives us
    const newTotalFrames = Math.ceil((newDurationMs / 1000) * PREVIEW_FPS)
    setSteps(newSteps)
    setDurationMs(newDurationMs)
    setTotalFrames(newTotalFrames)
    setCurrentFrame(0)
  }, [config])

  // Animation loop
  useEffect(() => {
    if (!isPlaying || totalFrames === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTimeRef.current >= FRAME_DURATION) {
        setCurrentFrame((prev) => {
          const next = prev + 1
          return next >= totalFrames ? 0 : next
        })
        lastFrameTimeRef.current = timestamp
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    lastFrameTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isPlaying, totalFrames])

  // Convert current frame to time and get frame state
  const timeMs = (currentFrame / PREVIEW_FPS) * 1000
  const frameState = interpolateFrameAtTime(steps, timeMs)

  const play = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])
  const restart = useCallback(() => {
    setCurrentFrame(0)
    setIsPlaying(true)
  }, [])
  const setFrame = useCallback((frame: number) => {
    setCurrentFrame(Math.max(0, Math.min(frame, totalFrames - 1)))
  }, [totalFrames])

  return {
    currentFrame,
    totalFrames,
    durationMs,
    frameState,
    isPlaying,
    play,
    pause,
    restart,
    setFrame,
  }
}
