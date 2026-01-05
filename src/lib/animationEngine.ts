import { type AnimationConfig, type AnimationStep, type FrameState, SOCIAL_CONFIG } from './types'

const PAUSE_FRAMES = 24 // ~2 seconds at 12fps
const DELETE_SPEED_FACTOR = 0.5 // Delete is faster than typing

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
    steps.push({ type: 'pause', duration: PAUSE_FRAMES })
    currentSuffix = ` ${name}`
  }

  // Step 3: Delete name, type role
  if (role) {
    if (currentSuffix) {
      steps.push({ type: 'delete', count: currentSuffix.length })
    }
    steps.push({ type: 'type', text: ` ${role}` })
    steps.push({ type: 'pause', duration: PAUSE_FRAMES })
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
    steps.push({ type: 'pause', duration: PAUSE_FRAMES })
    currentSuffix = displayText
  }

  // Final pause before loop
  steps.push({ type: 'pause', duration: PAUSE_FRAMES * 2 })

  return steps
}

export function calculateTotalFrames(steps: AnimationStep[], speed: number): number {
  const framesPerChar = Math.max(1, Math.round((speed / 1000) * 12)) // Convert ms to frames at 12fps
  let total = 0

  for (const step of steps) {
    switch (step.type) {
      case 'type':
        total += step.text.length * framesPerChar
        break
      case 'delete':
        total += Math.ceil(step.count * framesPerChar * DELETE_SPEED_FACTOR)
        break
      case 'append':
        total += step.text.length * framesPerChar
        break
      case 'prepend':
        total += step.text.length * framesPerChar
        break
      case 'pause':
        total += step.duration
        break
    }
  }

  return total
}

export function interpolateFrame(
  steps: AnimationStep[],
  frameIndex: number,
  speed: number
): FrameState {
  const framesPerChar = Math.max(1, Math.round((speed / 1000) * 12))
  let currentFrame = 0
  let currentText = ''
  let cursorVisible = true

  for (const step of steps) {
    let stepDuration = 0

    switch (step.type) {
      case 'type':
        stepDuration = step.text.length * framesPerChar
        if (frameIndex < currentFrame + stepDuration) {
          const progress = frameIndex - currentFrame
          const charsTyped = Math.floor(progress / framesPerChar)
          currentText += step.text.substring(0, charsTyped + 1)
          cursorVisible = Math.floor(frameIndex / 6) % 2 === 0
          return { text: currentText, cursorVisible, backgroundFrame: frameIndex }
        }
        currentText += step.text
        break

      case 'delete':
        stepDuration = Math.ceil(step.count * framesPerChar * DELETE_SPEED_FACTOR)
        if (frameIndex < currentFrame + stepDuration) {
          const progress = frameIndex - currentFrame
          const charsDeleted = Math.min(
            Math.floor(progress / (framesPerChar * DELETE_SPEED_FACTOR)) + 1,
            step.count
          )
          const newLength = Math.max(0, currentText.length - charsDeleted)
          currentText = currentText.substring(0, newLength)
          cursorVisible = Math.floor(frameIndex / 6) % 2 === 0
          return { text: currentText, cursorVisible, backgroundFrame: frameIndex }
        }
        currentText = currentText.substring(0, Math.max(0, currentText.length - step.count))
        break

      case 'append':
        stepDuration = step.text.length * framesPerChar
        if (frameIndex < currentFrame + stepDuration) {
          const progress = frameIndex - currentFrame
          const charsTyped = Math.floor(progress / framesPerChar)
          const appendedText = step.text.substring(0, charsTyped + 1)
          cursorVisible = Math.floor(frameIndex / 6) % 2 === 0
          return { text: currentText + appendedText, cursorVisible, backgroundFrame: frameIndex }
        }
        currentText += step.text
        break

      case 'prepend':
        stepDuration = step.text.length * framesPerChar
        if (frameIndex < currentFrame + stepDuration) {
          const progress = frameIndex - currentFrame
          const charsTyped = Math.floor(progress / framesPerChar)
          const prependedText = step.text.substring(step.text.length - charsTyped - 1)
          cursorVisible = Math.floor(frameIndex / 6) % 2 === 0
          return { text: prependedText + currentText, cursorVisible, backgroundFrame: frameIndex }
        }
        currentText = step.text + currentText
        break

      case 'pause':
        stepDuration = step.duration
        if (frameIndex < currentFrame + stepDuration) {
          cursorVisible = Math.floor(frameIndex / 6) % 2 === 0
          return { text: currentText, cursorVisible, backgroundFrame: frameIndex }
        }
        break
    }

    currentFrame += stepDuration
  }

  // If we've gone past all steps, return final state
  cursorVisible = Math.floor(frameIndex / 6) % 2 === 0
  return { text: currentText, cursorVisible, backgroundFrame: frameIndex }
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
    speed: 50,
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
  }
}
