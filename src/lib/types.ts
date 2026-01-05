export type BackgroundType = 'particle' | 'matrix' | 'gameoflife' | 'plain'

export type SocialType = 'x' | 'sns' | 'ens' | 'youtube' | 'github'

export interface Social {
  type: SocialType
  handle: string
  enabled: boolean
}

export interface FontConfig {
  family: 'mono' | 'sans' | 'serif'
  size: number // 16-32
  color: string // hex color
  bold: boolean
  italic: boolean
}

export interface BackgroundConfig {
  type: BackgroundType
  color: string // hex color for animation
  width: number
  height: number
}

export interface AnimationConfig {
  introText: string
  name: string
  role: string
  socials: Social[]
  speed: number // 1-100 ms per character
  font: FontConfig
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

// Social display config
export const SOCIAL_CONFIG: Record<SocialType, { prefix: string; suffix: string; label: string }> = {
  x: { prefix: 'x.com/', suffix: '', label: 'X (Twitter)' },
  sns: { prefix: '', suffix: '.sol', label: 'SNS (Solana)' },
  ens: { prefix: '', suffix: '.eth', label: 'ENS' },
  youtube: { prefix: 'youtube.com/@', suffix: '', label: 'YouTube' },
  github: { prefix: 'github.com/', suffix: '', label: 'GitHub' },
}

// Font families mapping
export const FONT_FAMILIES: Record<FontConfig['family'], string> = {
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  sans: "'Inter', 'Helvetica Neue', sans-serif",
  serif: "'Georgia', 'Times New Roman', serif",
}

// Preset colors for quick selection
export const COLOR_PRESETS = [
  { name: 'Lavender', value: '#9b5de5' },
  { name: 'Pink', value: '#f15bb5' },
  { name: 'Banana', value: '#fee440' },
  { name: 'Sky', value: '#00bbf9' },
  { name: 'Aqua', value: '#00f5d4' },
  { name: 'Orange', value: '#ff6b35' },
  { name: 'Green', value: '#2ec4b6' },
  { name: 'Red', value: '#e63946' },
]

// Helper to generate glow color from hex
export function hexToGlow(hex: string, opacity = 0.3): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// Helper to darken a hex color
export function darkenHex(hex: string, amount = 0.2): string {
  const r = Math.max(0, Math.floor(parseInt(hex.slice(1, 3), 16) * (1 - amount)))
  const g = Math.max(0, Math.floor(parseInt(hex.slice(3, 5), 16) * (1 - amount)))
  const b = Math.max(0, Math.floor(parseInt(hex.slice(5, 7), 16) * (1 - amount)))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
