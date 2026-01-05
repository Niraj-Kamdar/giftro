import { useRef, useCallback } from 'react'
import { renderFrame, type RenderOptions } from '../lib/canvasRenderer'
import { createBackgroundState, updateBackgroundState } from '../lib/backgroundRenderer'
import { type FrameState, type BackgroundType } from '../lib/types'

export function useCanvasRenderer(options: RenderOptions & { backgroundType: BackgroundType }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const backgroundStateRef = useRef(
    createBackgroundState(options.backgroundType, options.width, options.height)
  )

  const render = useCallback(
    (frameState: FrameState) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Update background state
      backgroundStateRef.current = updateBackgroundState(
        backgroundStateRef.current,
        options.width,
        options.height
      )

      // Render the frame
      renderFrame(ctx, frameState, backgroundStateRef.current, {
        width: options.width,
        height: options.height,
        colorScheme: options.colorScheme,
      })
    },
    [options.width, options.height, options.colorScheme]
  )

  const resetBackground = useCallback(() => {
    backgroundStateRef.current = createBackgroundState(
      options.backgroundType,
      options.width,
      options.height
    )
  }, [options.backgroundType, options.width, options.height])

  const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas
  }, [])

  const getCanvas = useCallback(() => canvasRef.current, [])

  const getContext = useCallback(() => {
    const canvas = canvasRef.current
    return canvas?.getContext('2d') ?? null
  }, [])

  return {
    canvasRef: setCanvasRef,
    render,
    resetBackground,
    getCanvas,
    getContext,
  }
}
