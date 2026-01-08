import { type AnimationConfig, type AnimationStep, type FrameState, SOCIAL_CONFIG } from './types'

// Timing constants (milliseconds)
const MS_PER_CHAR_TYPE = 80 // Time to type one character
const MS_PER_CHAR_DELETE = 40 // Time to delete one character (faster than typing)
const MS_PAUSE_BASE = 800 // Base pause duration between sections
const CURSOR_BLINK_MS = 300 // Cursor blink interval

export function generateAnimationSteps(config: AnimationConfig): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { introText, name, role, socials } = config

  // Track current text after intro to know what to delete
  let currentSuffix = ''

  // Step 1: Type the intro
  steps.push({ type: 'type', text: introText })

  // Step 2: Type name
  if (name) {
    steps.push({ type: 'type', text: ` ${name}` })
    steps.push({ type: 'pause', duration: 1 }) // 1x base pause
    currentSuffix = ` ${name}`
  }

  // Step 3: Delete name, type role
  if (role) {
    if (currentSuffix) {
      steps.push({ type: 'delete', count: currentSuffix.length })
    }
    steps.push({ type: 'type', text: ` ${role}` })
    steps.push({ type: 'pause', duration: 1 })
    currentSuffix = ` ${role}`
  }

  // Step 4: Process each enabled social
  const enabledSocials = socials.filter((s) => s.enabled && s.handle.trim())
  for (const social of enabledSocials) {
    if (currentSuffix) {
      steps.push({ type: 'delete', count: currentSuffix.length })
    }

    const socialConfig = SOCIAL_CONFIG[social.type]
    const displayText = ` ${socialConfig.prefix}${social.handle}${socialConfig.suffix}`
    steps.push({ type: 'type', text: displayText })
    steps.push({ type: 'pause', duration: 1 })
    currentSuffix = displayText
  }

  // Final pause before loop
  steps.push({ type: 'pause', duration: 2 }) // 2x base pause

  return steps
}

/**
 * Calculate the total duration of the animation in milliseconds
 */
export function calculateDurationMs(steps: AnimationStep[]): number {
  let duration = 0

  for (const step of steps) {
    switch (step.type) {
      case 'type':
        duration += step.text.length * MS_PER_CHAR_TYPE
        break
      case 'delete':
        duration += step.count * MS_PER_CHAR_DELETE
        break
      case 'append':
        duration += step.text.length * MS_PER_CHAR_TYPE
        break
      case 'prepend':
        duration += step.text.length * MS_PER_CHAR_TYPE
        break
      case 'pause':
        duration += step.duration * MS_PAUSE_BASE
        break
    }
  }

  return duration
}

/**
 * Get the animation state at a specific time in milliseconds
 */
export function interpolateFrameAtTime(
  steps: AnimationStep[],
  timeMs: number
): FrameState {
  let currentTimeMs = 0
  let currentText = ''
  const cursorVisible = Math.floor(timeMs / CURSOR_BLINK_MS) % 2 === 0

  for (const step of steps) {
    let stepDurationMs = 0

    switch (step.type) {
      case 'type':
        stepDurationMs = step.text.length * MS_PER_CHAR_TYPE
        if (timeMs < currentTimeMs + stepDurationMs) {
          const progress = timeMs - currentTimeMs
          const charsTyped = Math.floor(progress / MS_PER_CHAR_TYPE)
          currentText += step.text.substring(0, charsTyped + 1)
          return { text: currentText, cursorVisible, backgroundFrame: Math.floor(timeMs / 16) }
        }
        currentText += step.text
        break

      case 'delete':
        stepDurationMs = step.count * MS_PER_CHAR_DELETE
        if (timeMs < currentTimeMs + stepDurationMs) {
          const progress = timeMs - currentTimeMs
          const charsDeleted = Math.min(
            Math.floor(progress / MS_PER_CHAR_DELETE) + 1,
            step.count
          )
          const newLength = Math.max(0, currentText.length - charsDeleted)
          currentText = currentText.substring(0, newLength)
          return { text: currentText, cursorVisible, backgroundFrame: Math.floor(timeMs / 16) }
        }
        currentText = currentText.substring(0, Math.max(0, currentText.length - step.count))
        break

      case 'append':
        stepDurationMs = step.text.length * MS_PER_CHAR_TYPE
        if (timeMs < currentTimeMs + stepDurationMs) {
          const progress = timeMs - currentTimeMs
          const charsTyped = Math.floor(progress / MS_PER_CHAR_TYPE)
          const appendedText = step.text.substring(0, charsTyped + 1)
          return { text: currentText + appendedText, cursorVisible, backgroundFrame: Math.floor(timeMs / 16) }
        }
        currentText += step.text
        break

      case 'prepend':
        stepDurationMs = step.text.length * MS_PER_CHAR_TYPE
        if (timeMs < currentTimeMs + stepDurationMs) {
          const progress = timeMs - currentTimeMs
          const charsTyped = Math.floor(progress / MS_PER_CHAR_TYPE)
          const prependedText = step.text.substring(step.text.length - charsTyped - 1)
          return { text: prependedText + currentText, cursorVisible, backgroundFrame: Math.floor(timeMs / 16) }
        }
        currentText = step.text + currentText
        break

      case 'pause':
        stepDurationMs = step.duration * MS_PAUSE_BASE
        if (timeMs < currentTimeMs + stepDurationMs) {
          return { text: currentText, cursorVisible, backgroundFrame: Math.floor(timeMs / 16) }
        }
        break
    }

    currentTimeMs += stepDurationMs
  }

  // If we've gone past all steps, return final state
  return { text: currentText, cursorVisible, backgroundFrame: Math.floor(timeMs / 16) }
}

export function getDefaultConfig(): AnimationConfig {
  return {
    introText: 'Hey there! I am',
    name: 'Niraj',
    role: 'Software Engineer',
    socials: [
      { type: 'x', handle: '0xkniraj', enabled: true },
      { type: 'sns', handle: '0xkniraj', enabled: true },
      { type: 'ens', handle: '0xkniraj.farcaster', enabled: true },
    ],
    font: {
      family: 'mono',
      size: 24,
      color: '#ffffff',
      bold: false,
      italic: false,
    },
    background: {
      type: 'particle',
      color: '#9b5de5',
      width: 600,
      height: 200,
    },
    gif: {
      fps: 12, // Middle ground (range: 4-20)
      playbackSpeed: 1,
      compression: {
        enabled: true,
        lossy: 50,
        optimizationLevel: 2,
        colors: null,
      },
    },
  }
}
