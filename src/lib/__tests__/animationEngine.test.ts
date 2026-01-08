import { describe, it, expect } from 'vitest'
import {
  generateAnimationSteps,
  calculateDurationMs,
  interpolateFrameAtTime,
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
      expect(config.font.family).toBe('mono')
      expect(config.font.size).toBe(24)
      expect(config.font.color).toBe('#ffffff')
      expect(config.background.type).toBe('particle')
      expect(config.background.color).toBe('#9b5de5')
      expect(config.gif.fps).toBe(12)
      expect(config.gif.playbackSpeed).toBe(1)
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

  describe('calculateDurationMs', () => {
    it('calculates positive duration', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)
      const durationMs = calculateDurationMs(steps)

      expect(durationMs).toBeGreaterThan(0)
    })

    it('duration scales with content length', () => {
      const shortConfig: AnimationConfig = {
        ...getDefaultConfig(),
        introText: 'Hi',
        name: '',
        role: '',
        socials: [],
      }
      const longConfig: AnimationConfig = {
        ...getDefaultConfig(),
        introText: 'Hello, welcome to my profile!',
        name: 'Alexander',
        role: 'Senior Software Engineer',
        socials: [],
      }

      const shortSteps = generateAnimationSteps(shortConfig)
      const longSteps = generateAnimationSteps(longConfig)

      const shortDuration = calculateDurationMs(shortSteps)
      const longDuration = calculateDurationMs(longSteps)

      expect(longDuration).toBeGreaterThan(shortDuration)
    })
  })

  describe('interpolateFrameAtTime', () => {
    it('starts with partial text at time 0', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const frame = interpolateFrameAtTime(steps, 0)
      expect(frame.text.length).toBeLessThanOrEqual(1)
    })

    it('builds up text progressively', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const frame100ms = interpolateFrameAtTime(steps, 100)
      const frame500ms = interpolateFrameAtTime(steps, 500)

      expect(frame500ms.text.length).toBeGreaterThan(frame100ms.text.length)
    })

    it('toggles cursor visibility', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const frame0 = interpolateFrameAtTime(steps, 0)
      const frame300 = interpolateFrameAtTime(steps, 300)

      // Cursor blinks every 300ms
      expect(frame0.cursorVisible).not.toBe(frame300.cursorVisible)
    })

    it('includes background frame number', () => {
      const config = getDefaultConfig()
      const steps = generateAnimationSteps(config)

      const frame = interpolateFrameAtTime(steps, 1000)
      // backgroundFrame is timeMs / 16 (roughly 60fps for background)
      expect(frame.backgroundFrame).toBe(Math.floor(1000 / 16))
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
      const durationMs = calculateDurationMs(steps)

      const finalFrame = interpolateFrameAtTime(steps, durationMs - 1)
      expect(finalFrame.text).toBeDefined()
    })
  })
})
