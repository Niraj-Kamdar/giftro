export type BackgroundType = 'particle' | 'matrix' | 'gameoflife' | 'plain'

export type ColorScheme = 'lavender' | 'pink' | 'banana' | 'sky' | 'aqua'

export interface BackgroundConfig {
  type: BackgroundType
  colorScheme: ColorScheme
  width: number
  height: number
}

export interface AnimationConfig {
  introText: string
  name: string
  prefix: string
  handles: {
    sol: boolean
    farcaster: boolean
    twitter: boolean
  }
  speed: number // ms per character
  background: BackgroundConfig
}

export type AnimationStep =
  | { type: 'type'; text: string }
  | { type: 'delete'; count: number }
  | { type: 'append'; text: string }
  | { type: 'prepend'; text: string }
  | { type: 'pause'; duration: number }

export interface FrameState {
  text: string
  cursorVisible: boolean
  backgroundFrame: number
}

export const COLOR_VALUES: Record<ColorScheme, { primary: string; secondary: string; glow: string }> = {
  lavender: { primary: '#9b5de5', secondary: '#7725dc', glow: 'rgba(155, 93, 229, 0.3)' },
  pink: { primary: '#f15bb5', secondary: '#eb1e99', glow: 'rgba(241, 91, 181, 0.3)' },
  banana: { primary: '#fee440', secondary: '#fcda01', glow: 'rgba(254, 228, 64, 0.3)' },
  sky: { primary: '#00bbf9', secondary: '#0096c8', glow: 'rgba(0, 187, 249, 0.3)' },
  aqua: { primary: '#00f5d4', secondary: '#00c4aa', glow: 'rgba(0, 245, 212, 0.3)' },
}
