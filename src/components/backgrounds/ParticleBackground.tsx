import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

interface ParticleBackgroundProps {
  width: number
  height: number
  color: string // hex color
  className?: string
}

const PARTICLE_COUNT = 50

export function ParticleBackground({ width, height, color, className }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize particles
    particlesRef.current = initParticles(width, height)

    let animationId: number

    const animate = () => {
      updateParticles(particlesRef.current, width, height)
      renderParticleBackground(ctx, width, height, color, particlesRef.current, frameRef.current)
      frameRef.current++
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [width, height, color])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
    />
  )
}

export function initParticles(width: number, height: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.2,
  }))
}

export function updateParticles(particles: Particle[], width: number, height: number) {
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy

    // Wrap around edges
    if (p.x < 0) p.x = width
    if (p.x > width) p.x = 0
    if (p.y < 0) p.y = height
    if (p.y > height) p.y = 0
  }
}

export function renderParticleBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  particles: Particle[],
  _frame: number
) {
  // Clear with dark background
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, width, height)

  // Draw particles
  for (const p of particles) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `${color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`
    ctx.fill()

    // Glow effect
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
    ctx.fillStyle = `${color}${Math.floor(p.opacity * 50).toString(16).padStart(2, '0')}`
    ctx.fill()
  }

  // Draw connections between nearby particles
  ctx.strokeStyle = `${color}20`
  ctx.lineWidth = 0.5

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 80) {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }
}
