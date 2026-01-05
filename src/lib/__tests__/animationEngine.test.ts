import { describe, it, expect } from 'vitest'
import {
  generateAnimationSteps,
  calculateTotalFrames,
  interpolateFrame,
  getDefaultConfig,
} from '../animationEngine'
import type { AnimationConfig } from '../types'

describe('animationEngine', () => {
  describe('getDefaultConfig', () => {
    it('returns default configuration', () => {
      const config = getDefaultConfig()

      expect(config.introText).toBe('Hey there! I am')
      expect(config.name).toBe('Niraj')
      expect(config.prefix).toBe('0xk')
      expect(config.handles.sol).toBe(true)
      expect(config.handles.farcaster).toBe(true)
      expect(config.handles.twitter).toBe(true)
      expect(config.speed).toBe(50)
      expect(config.background.type).toBe('particle')
      expect(config.background.colorScheme).toBe('lavender')
    })
  })

  describe('generateAnimationSteps', () => {
    it('generates type step for intro with name', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      expect(steps[0]).toEqual({ type: 'type', text: 'Hey there! I am Niraj' })
    })

    it('generates delete step for name transformation', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      // After pause, should delete the name
      const deleteStep = steps.find((s) => s.type === 'delete')
      expect(deleteStep).toBeDefined()
      expect(deleteStep?.type === 'delete' && deleteStep.count).toBe(5) // "Niraj" length
    })

    it('generates append steps for handles', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const appendSteps = steps.filter((s) => s.type === 'append')
      expect(appendSteps.length).toBeGreaterThan(0)
    })

    it('generates steps only for enabled handles', () => {
      const config: AnimationConfig = {
        ...getDefaultConfig(),
        handles: { sol: true, farcaster: false, twitter: false },
      }
      const steps = generateAnimationSteps(config)

      const appendSteps = steps.filter((s) => s.type === 'append')
      expect(appendSteps.length).toBe(1)
      expect(appendSteps[0].type === 'append' && appendSteps[0].text).toBe('.sol')
    })

    it('generates prepend step for twitter URL', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const prependStep = steps.find((s) => s.type === 'prepend')
      expect(prependStep).toBeDefined()
      expect(prependStep?.type === 'prepend' && prependStep.text).toBe('https://x.com/')
    })

    it('handles empty name gracefully', () => {
      const config: AnimationConfig = {
        ...getDefaultConfig(),
        name: '',
      }
      const steps = generateAnimationSteps(config)

      expect(steps.length).toBeGreaterThan(0)
    })
  })

  describe('calculateTotalFrames', () => {
    it('calculates positive frame count', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)
      const totalFrames = calculateTotalFrames(steps, config.speed)

      expect(totalFrames).toBeGreaterThan(0)
    })

    it('increases with slower speed', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const fastFrames = calculateTotalFrames(steps, 30)
      const slowFrames = calculateTotalFrames(steps, 150)

      expect(slowFrames).toBeGreaterThan(fastFrames)
    })
  })

  describe('interpolateFrame', () => {
    it('starts with empty text at frame 0', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const frame = interpolateFrame(steps, 0, config.speed)
      expect(frame.text.length).toBeLessThanOrEqual(1)
    })

    it('builds up text progressively', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const frame10 = interpolateFrame(steps, 10, config.speed)
      const frame50 = interpolateFrame(steps, 50, config.speed)

      expect(frame50.text.length).toBeGreaterThan(frame10.text.length)
    })

    it('toggles cursor visibility', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const frame0 = interpolateFrame(steps, 0, config.speed)
      const frame6 = interpolateFrame(steps, 6, config.speed)

      // Cursor blinks every 6 frames
      expect(frame0.cursorVisible).not.toBe(frame6.cursorVisible)
    })

    it('includes background frame number', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const frame = interpolateFrame(steps, 42, config.speed)
      expect(frame.backgroundFrame).toBe(42)
    })

    it('handles special characters in name', () => {
      const config: AnimationConfig = {
        ...getDefaultConfig(),
        name: 'Test-User_123',
      }
      const steps = generateAnimationSteps(config)
      const totalFrames = calculateTotalFrames(steps, config.speed)

      const finalFrame = interpolateFrame(steps, totalFrames - 1, config.speed)
      expect(finalFrame.text).toBeDefined()
    })
  })
})
