import { motion } from 'framer-motion'
import { type AnimationConfig, type BackgroundType, type ColorScheme } from '../lib/types'

interface InputFormProps {
  config: AnimationConfig
  onChange: (config: AnimationConfig) => void
}

const BACKGROUND_OPTIONS: { value: BackgroundType; label: string }[] = [
  { value: 'particle', label: 'Particles' },
  { value: 'matrix', label: 'Matrix' },
  { value: 'gameoflife', label: 'Game of Life' },
  { value: 'plain', label: 'Plain' },
]

const COLOR_OPTIONS: { value: ColorScheme; label: string; color: string }[] = [
  { value: 'lavender', label: 'Lavender', color: '#9b5de5' },
  { value: 'pink', label: 'Pink', color: '#f15bb5' },
  { value: 'banana', label: 'Banana', color: '#fee440' },
  { value: 'sky', label: 'Sky', color: '#00bbf9' },
  { value: 'aqua', label: 'Aqua', color: '#00f5d4' },
]

export function InputForm({ config, onChange }: InputFormProps) {
  const updateConfig = <K extends keyof AnimationConfig>(key: K, value: AnimationConfig[K]) => {
    onChange({ ...config, [key]: value })
  }

  const updateHandles = (handle: keyof AnimationConfig['handles'], value: boolean) => {
    onChange({
      ...config,
      handles: { ...config.handles, [handle]: value },
    })
  }

  const updateBackground = <K extends keyof AnimationConfig['background']>(
    key: K,
    value: AnimationConfig['background'][K]
  ) => {
    onChange({
      ...config,
      background: { ...config.background, [key]: value },
    })
  }

  return (
    <div className="space-y-6">
      {/* Intro Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium text-white/70 mb-2">
          Intro Text
        </label>
        <input
          type="text"
          value={config.introText}
          onChange={(e) => updateConfig('introText', e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-lavender-500 transition-colors"
          placeholder="Hey there! I am"
        />
      </motion.div>

      {/* Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <label className="block text-sm font-medium text-white/70 mb-2">
          Your Name <span className="text-pink-500">*</span>
        </label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => updateConfig('name', e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-lavender-500 transition-colors"
          placeholder="Niraj"
          required
        />
      </motion.div>

      {/* Prefix */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-white/70 mb-2">
          Username Prefix
        </label>
        <input
          type="text"
          value={config.prefix}
          onChange={(e) => updateConfig('prefix', e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-lavender-500 transition-colors"
          placeholder="0xk"
        />
      </motion.div>

      {/* Handles */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <label className="block text-sm font-medium text-white/70 mb-3">
          Include Handles
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={config.handles.sol}
              onChange={(e) => updateHandles('sol', e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-lavender-500 focus:ring-lavender-500/50"
            />
            <span className="text-white/60 group-hover:text-white/80 transition-colors">.sol</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={config.handles.farcaster}
              onChange={(e) => updateHandles('farcaster', e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-lavender-500 focus:ring-lavender-500/50"
            />
            <span className="text-white/60 group-hover:text-white/80 transition-colors">.farcaster.eth</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={config.handles.twitter}
              onChange={(e) => updateHandles('twitter', e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-lavender-500 focus:ring-lavender-500/50"
            />
            <span className="text-white/60 group-hover:text-white/80 transition-colors">x.com/</span>
          </label>
        </div>
      </motion.div>

      {/* Speed */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-white/70 mb-2">
          Typing Speed: {config.speed}ms/char
        </label>
        <input
          type="range"
          min="30"
          max="150"
          value={config.speed}
          onChange={(e) => updateConfig('speed', Number(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lavender-500"
        />
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </motion.div>

      {/* Background Type */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <label className="block text-sm font-medium text-white/70 mb-3">
          Background Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BACKGROUND_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateBackground('type', option.value)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                config.background.type === option.value
                  ? 'border-lavender-500 bg-lavender-500/20 text-lavender-400'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Color Scheme */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm font-medium text-white/70 mb-3">
          Color Theme
        </label>
        <div className="flex gap-2">
          {COLOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateBackground('colorScheme', option.value)}
              title={option.label}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                config.background.colorScheme === option.value
                  ? 'border-white scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: option.color }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
