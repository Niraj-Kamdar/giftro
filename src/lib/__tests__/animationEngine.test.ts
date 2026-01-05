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
      expect(config.role).toBe('Software Engineer')
      expect(config.socials).toHaveLength(3)
      expect(config.socials[0]).toEqual({ type: 'x', handle: '0xkniraj', enabled: true })
      expect(config.speed).toBe(2) // 1-5 scale (1 = fast, 5 = slow)
      expect(config.font.family).toBe('mono')
      expect(config.font.size).toBe(24)
      expect(config.font.color).toBe('#ffffff')
      expect(config.background.type).toBe('particle')
      expect(config.background.color).toBe('#9b5de5')
      expect(config.gif.fps).toBe(10)
      expect(config.gif.quality).toBe(20)
    })
  })

  describe('generateAnimationSteps', () => {
    it('generates type step for intro', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      expect(steps[0]).toEqual({ type: 'type', text: 'Hey there! I am' })
    })

    it('generates type step for name with space', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      expect(steps[1]).toEqual({ type: 'type', text: ' Niraj' })
    })

    it('generates delete step before typing role', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      // After intro + name + pause, should delete name then type role
      const deleteStepIndex = steps.findIndex(
        (s, i) => s.type === 'delete' && i > 2
      )
      expect(deleteStepIndex).toBeGreaterThan(0)

      const deleteStep = steps[deleteStepIndex]
      expect(deleteStep.type === 'delete' && deleteStep.count).toBe(6) // " Niraj" length
    })

    it('generates steps for enabled socials', () => {
      const config: AnimationConfig = {
        ...getDefaultConfig(),
        role: '',
        socials: [
          { type: 'x', handle: '0xkniraj', enabled: true },
        ],
      }
      const steps = generateAnimationSteps(config)

      const xStep = steps.find(
        (s) => s.type === 'type' && s.text.includes('x.com/')
      )
      expect(xStep).toBeDefined()
      expect(xStep?.type === 'type' && xStep.text).toBe(' x.com/0xkniraj')
    })

    it('skips disabled socials', () => {
      const config: AnimationConfig = {
        ...getDefaultConfig(),
        role: '',
        socials: [
          { type: 'x', handle: '0xkniraj', enabled: false },
          { type: 'sns', handle: 'test', enabled: true },
        ],
      }
      const steps = generateAnimationSteps(config)

      const xStep = steps.find(
        (s) => s.type === 'type' && s.text.includes('x.com/')
      )
      const snsStep = steps.find(
        (s) => s.type === 'type' && s.text.includes('.sol')
      )

      expect(xStep).toBeUndefined()
      expect(snsStep).toBeDefined()
    })

    it('skips socials with empty handles', () => {
      const config: AnimationConfig = {
        ...getDefaultConfig(),
        role: '',
        socials: [
          { type: 'x', handle: '', enabled: true },
        ],
      }
      const steps = generateAnimationSteps(config)

      const xStep = steps.find(
        (s) => s.type === 'type' && s.text.includes('x.com/')
      )
      expect(xStep).toBeUndefined()
    })

    it('generates steps for all social types', () => {
      const config: AnimationConfig = {
        ...getDefaultConfig(),
        role: '',
        socials: [
          { type: 'x', handle: 'test', enabled: true },
          { type: 'sns', handle: 'test', enabled: true },
          { type: 'ens', handle: 'test', enabled: true },
          { type: 'youtube', handle: 'test', enabled: true },
          { type: 'github', handle: 'test', enabled: true },
        ],
      }
      const steps = generateAnimationSteps(config)

      expect(steps.some((s) => s.type === 'type' && s.text.includes('x.com/'))).toBe(true)
      expect(steps.some((s) => s.type === 'type' && s.text.includes('.sol'))).toBe(true)
      expect(steps.some((s) => s.type === 'type' && s.text.includes('.eth'))).toBe(true)
      expect(steps.some((s) => s.type === 'type' && s.text.includes('youtube.com/@'))).toBe(true)
      expect(steps.some((s) => s.type === 'type' && s.text.includes('github.com/'))).toBe(true)
    })

    it('handles empty name gracefully', () => {
      const config: AnimationConfig = {
        ...getDefaultConfig(),
        name: '',
      }
      const steps = generateAnimationSteps(config)

      expect(steps.length).toBeGreaterThan(0)
      expect(steps[0]).toEqual({ type: 'type', text: 'Hey there! I am' })
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

      const fastFrames = calculateTotalFrames(steps, 1)
      const slowFrames = calculateTotalFrames(steps, 5)

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

    it('handles special characters in handles', () => {
      const config: AnimationConfig = {
        ...getDefaultConfig(),
        socials: [
          { type: 'x', handle: 'test-user_123', enabled: true },
          { type: 'ens', handle: 'test.subdomain', enabled: true },
        ],
      }
      const steps = generateAnimationSteps(config)
      const totalFrames = calculateTotalFrames(steps, config.speed)

      const finalFrame = interpolateFrame(steps, totalFrames - 1, config.speed)
      expect(finalFrame.text).toBeDefined()
    })
  })
})
