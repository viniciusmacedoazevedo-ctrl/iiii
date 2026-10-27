import { useEffect, useRef } from 'react'
import { useClock } from '../engine/clock'

export type ParticleKind = 'snow' | 'dust' | 'petals' | 'embers' | 'leaves'

interface ParticlesProps {
  kind?: ParticleKind
  count?: number
  wind?: number
  className?: string
}

interface P {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  phase: number
  hue: number
  depth: number
}

const COLORS: Record<ParticleKind, (p: P) => string> = {
  snow: (p) => `rgba(240,246,255,${0.35 + p.depth * 0.6})`,
  dust: (p) => `rgba(255,236,200,${0.12 + p.depth * 0.35})`,
  petals: (p) => `hsla(${340 + p.hue * 20},80%,82%,${0.4 + p.depth * 0.5})`,
  embers: (p) => `hsla(${28 + p.hue * 18},100%,${60 + p.depth * 15}%,${0.25 + p.depth * 0.6})`,
  leaves: (p) => `hsla(${12 + p.hue * 26},85%,${45 + p.depth * 12}%,${0.55 + p.depth * 0.4})`,
}

/** Partículas atmosféricas em canvas, com profundidade (tamanho, velocidade e desfoque). */
export function Particles({ kind = 'snow', count = 140, wind = 0.3, className = '' }: ParticlesProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { reduced, playing } = useClock()
  const playingRef = useRef(playing)
  playingRef.current = playing

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const n = reduced ? Math.round(count * 0.4) : window.innerWidth < 720 ? Math.round(count * 0.6) : count
    const parts: P[] = []

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    for (let i = 0; i < n; i++) {
      const depth = Math.random()
      parts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (kind === 'leaves' || kind === 'petals' ? 2.5 : 0.8) + depth * (kind === 'leaves' ? 4.5 : 2.6),
        vy: (kind === 'embers' ? -1 : 1) * (0.25 + depth * (kind === 'dust' ? 0.25 : 1.1)),
        vx: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random(),
        depth,
      })
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        ctx.fillStyle = COLORS[kind](p)
        ctx.beginPath()
        if (kind === 'leaves' || kind === 'petals') {
          ctx.ellipse(p.x, p.y, p.r, p.r * 0.55, p.phase + time / 900, 0, Math.PI * 2)
        } else {
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        }
        ctx.fill()
      }
    }

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(48, now - last) / 16.67
      last = now
      if (playingRef.current) {
        for (const p of parts) {
          p.phase += 0.012 * dt
          p.y += p.vy * dt
          p.x += (p.vx + Math.sin(p.phase) * 0.35 + wind * (0.4 + p.depth)) * dt
          if (p.y > h + 10) p.y = -10
          if (p.y < -10) p.y = h + 10
          if (p.x > w + 10) p.x = -10
          if (p.x < -10) p.x = w + 10
        }
      }
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw(0)
    })
    ro.observe(canvas)
    if (reduced) {
      draw(0)
    } else {
      raf = requestAnimationFrame(loop)
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [kind, count, wind, reduced])

  return <canvas ref={ref} className={`particles ${className}`} aria-hidden="true" />
}
