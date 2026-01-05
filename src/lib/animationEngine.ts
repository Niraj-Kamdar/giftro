import { type AnimationConfig, type AnimationStep, type FrameState } from './types'

const PAUSE_FRAMES = 24 // ~2 seconds at 12fps
const DELETE_SPEED_FACTOR = 0.5 // Delete is faster than typing

export function generateAnimationSteps(config: AnimationConfig): AnimationStep[] {
  const steps: AnimationStep[] = []
  const { introText, name, prefix, handles } = config

  // Step 1: Type the intro with name
  const fullIntro = `${introText} ${name}`
  steps.push({ type: 'type', text: fullIntro })
  steps.push({ type: 'pause', duration: PAUSE_FRAMES })

  // Step 2: Transform to lowercase and add prefix
  const lowercaseName = name.toLowerCase()
  const username = `${prefix}${lowercaseName}`

  // Delete the name part character by character
  steps.push({ type: 'delete', count: name.length })

  // Type the username
  steps.push({ type: 'type', text: username })

  // Step 3: Add .sol handle
  if (handles.sol) {
    steps.push({ type: 'append', text: '.sol' })
    steps.push({ type: 'pause', duration: PAUSE_FRAMES })

    // Transform to farcaster
    if (handles.farcaster) {
      steps.push({ type: 'delete', count: 4 }) // Delete ".sol"
    }
  }

  // Step 4: Add farcaster handle
  if (handles.farcaster) {
    steps.push({ type: 'append', text: '.farcaster.eth' })
    steps.push({ type: 'pause', duration: PAUSE_FRAMES })

    // Transform to twitter
    if (handles.twitter) {
      steps.push({ type: 'delete', count: 14 }) // Delete ".farcaster.eth"
    }
  }

  // Step 5: Transform to Twitter URL
  if (handles.twitter) {
    // Delete the intro part if we have username
    const introLength = introText.length + 1 // +1 for space
    steps.push({ type: 'delete', count: introLength })

    // Prepend the URL
    steps.push({ type: 'prepend', text: 'https://x.com/' })
    steps.push({ type: 'pause', duration: PAUSE_FRAMES })
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
          const charsDeleted = Math.floor(progress / (framesPerChar * DELETE_SPEED_FACTOR))
          currentText = currentText.substring(0, currentText.length - charsDeleted - 1)
          cursorVisible = Math.floor(frameIndex / 6) % 2 === 0
          return { text: currentText, cursorVisible, backgroundFrame: frameIndex }
        }
        currentText = currentText.substring(0, currentText.length - step.count)
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
    prefix: '0xk',
    handles: {
      sol: true,
      farcaster: true,
      twitter: true,
    },
    speed: 50,
    background: {
      type: 'particle',
      colorScheme: 'lavender',
      width: 600,
      height: 200,
    },
  }
}
