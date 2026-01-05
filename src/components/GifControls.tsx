import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateGif, downloadBlob, formatFileSize } from '../lib/gifEncoder'
import { type AnimationConfig } from '../lib/types'

interface GifControlsProps {
  config: AnimationConfig
  disabled?: boolean
}

interface GenerationState {
  isGenerating: boolean
  phase: 'idle' | 'rendering' | 'encoding' | 'complete'
  progress: number
  currentFrame?: number
  totalFrames?: number
  blob?: Blob
  error?: string
}

export function GifControls({ config, disabled }: GifControlsProps) {
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    phase: 'idle',
    progress: 0,
  })

  const handleGenerate = async () => {
    if (state.isGenerating) return

    setState({
      isGenerating: true,
      phase: 'rendering',
      progress: 0,
    })

    try {
      const blob = await generateGif(config, (progress) => {
        setState((prev) => ({
          ...prev,
          phase: progress.phase,
          progress: progress.progress,
          currentFrame: progress.currentFrame,
          totalFrames: progress.totalFrames,
        }))
      })

      setState({
        isGenerating: false,
        phase: 'complete',
        progress: 100,
        blob,
      })
    } catch (error) {
      setState({
        isGenerating: false,
        phase: 'idle',
        progress: 0,
        error: error instanceof Error ? error.message : 'Failed to generate GIF',
      })
    }
  }

  const handleDownload = () => {
    if (!state.blob) return
    const filename = `${config.prefix}${config.name.toLowerCase()}-intro.gif`
    downloadBlob(state.blob, filename)
  }

  const handleReset = () => {
    setState({
      isGenerating: false,
      phase: 'idle',
      progress: 0,
    })
  }

  const isDisabled = disabled || !config.name.trim()

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {state.phase === 'complete' && state.blob ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between p-4 bg-aqua-500/10 border border-aqua-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-aqua-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-aqua-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">GIF Generated!</p>
                  <p className="text-xs text-white/50">{formatFileSize(state.blob.size)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-lavender-500 to-pink-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Download GIF
              </button>
              <button
                onClick={handleReset}
                className="py-3 px-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                title="Generate another"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </motion.div>
        ) : state.isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/70">
                  {state.phase === 'rendering' ? 'Rendering frames...' : 'Encoding GIF...'}
                </span>
                <span className="text-sm text-white/50">{state.progress}%</span>
              </div>

              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-lavender-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${state.progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {state.currentFrame && state.totalFrames && (
                <p className="mt-2 text-xs text-white/40 text-center">
                  Frame {state.currentFrame} / {state.totalFrames}
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              onClick={handleGenerate}
              disabled={isDisabled}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                isDisabled
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-lavender-500 to-pink-500 hover:opacity-90'
              }`}
            >
              Generate GIF
            </button>

            {!config.name.trim() && (
              <p className="mt-2 text-xs text-pink-500 text-center">
                Please enter your name to generate a GIF
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {state.error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-lg"
        >
          <p className="text-sm text-pink-400">{state.error}</p>
        </motion.div>
      )}
    </div>
  )
}
