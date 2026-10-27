import { motion } from 'framer-motion'
import { memo, useId, useMemo } from 'react'

/* Cenários canadenses ilustrados em SVG, em camadas de parallax. */

const useSvgId = () => useId().replace(/[^a-zA-Z0-9_-]/g, '')

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Linha de pinheiros como um único path (barato de renderizar). */
function pines(baseY: number, count: number, minH: number, maxH: number, seed: number, width = 2200) {
  const r = rng(seed)
  let d = ''
  for (let i = 0; i < count; i++) {
    const x = (i / count) * width + r() * (width / count) * 0.8 - 300
    const h = minH + r() * (maxH - minH)
    const w = h * (0.32 + r() * 0.1)
    const tiers = 3
    for (let k = 0; k < tiers; k++) {
      const top = baseY - h + (k * h) / (tiers + 0.6)
      const bottom = baseY - (h * (tiers - 1 - k)) / (tiers + 1.6)
      const half = (w / 2) * (0.55 + (k / tiers) * 0.6)
      d += `M${x} ${top} L${x + half} ${bottom} L${x - half} ${bottom} Z `
    }
    d += `M${x - w * 0.05} ${baseY - h * 0.1} h${w * 0.1} v${h * 0.12} h${-w * 0.1} Z `
  }
  return d
}

function ridge(baseY: number, amp: number, seed: number, peaks = 7, width = 2200) {
  const r = rng(seed)
  let d = `M-300 ${baseY}`
  const step = width / peaks
  for (let i = 0; i <= peaks; i++) {
    const x = -300 + i * step
    const peakY = baseY - amp * (0.45 + r() * 0.55)
    d += ` L${x + step * 0.5} ${peakY} L${x + step} ${baseY - amp * r() * 0.25}`
  }
  return `${d} L${width} 1000 L-300 1000 Z`
}

export type Palette = 'winter' | 'night' | 'sunset' | 'spring' | 'dusk'

const PALETTES: Record<
  Palette,
  { sky: [string, string, string]; sun: string; far: string; mid: string; snow: string; trees: string; ground: string; lake: string }
> = {
  winter: { sky: ['#5f7fa6', '#a9c1da', '#e6eef6'], sun: '#fff6e6', far: '#7d93b0', mid: '#4d6585', snow: '#eef4fb', trees: '#1f3a3f', ground: '#dde7f2', lake: '#6f8cae' },
  night: { sky: ['#05070d', '#0d1424', '#1d2840'], sun: '#cfe0ff', far: '#1c2639', mid: '#121a2a', snow: '#8ea3c4', trees: '#070c14', ground: '#2b3a55', lake: '#0d1527' },
  sunset: { sky: ['#3b2b5a', '#e0716a', '#ffcf8a'], sun: '#ffe2a6', far: '#9a6a8a', mid: '#5e3f63', snow: '#ffd9c0', trees: '#2a1a2c', ground: '#f1b98f', lake: '#d9806f' },
  spring: { sky: ['#6aa2d8', '#a8d4ee', '#f1f7e8'], sun: '#fffbe0', far: '#7ea4b6', mid: '#4f7c78', snow: '#f4f8fa', trees: '#21493a', ground: '#9cc28a', lake: '#6fa8c8' },
  dusk: { sky: ['#1a1a3a', '#5a4a7a', '#e9a27a'], sun: '#ffd2a0', far: '#4a4468', mid: '#2e2a48', snow: '#c8b8d8', trees: '#15122a', ground: '#7a6a8f', lake: '#4a3f6a' },
}

interface LandscapeProps {
  palette?: Palette
  /** Deslocamento da câmera (px) ao longo da cena — multiplicado por camada. */
  pan?: number
  duration?: number
  sunY?: number
  lake?: boolean
  className?: string
}

export const Landscape = memo(function Landscape({ palette = 'winter', pan = 120, duration = 18, sunY = 300, lake = true, className = '' }: LandscapeProps) {
  const id = useSvgId()
  const c = PALETTES[palette]
  const geo = useMemo(
    () => ({
      far: ridge(560, 300, 11, 6),
      mid: ridge(640, 220, 29, 8),
      treesBack: pines(700, 70, 70, 120, 7),
      treesFront: pines(820, 34, 170, 280, 3),
    }),
    [],
  )
  const ease = 'linear' as const
  const layer = (factor: number) => ({
    initial: { x: 0 },
    animate: { x: -pan * factor },
    transition: { duration, ease },
  })

  return (
    <svg className={`scenery ${className}`} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.sky[0]} />
          <stop offset="0.6" stopColor={c.sky[1]} />
          <stop offset="1" stopColor={c.sky[2]} />
        </linearGradient>
        <radialGradient id={`${id}sun`}>
          <stop offset="0" stopColor={c.sun} stopOpacity="1" />
          <stop offset="0.12" stopColor={c.sun} stopOpacity="0.9" />
          <stop offset="0.4" stopColor={c.sun} stopOpacity="0.25" />
          <stop offset="1" stopColor={c.sun} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}lake`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.lake} />
          <stop offset="1" stopColor={c.mid} />
        </linearGradient>
        <linearGradient id={`${id}haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.sky[2]} stopOpacity="0" />
          <stop offset="0.4" stopColor={c.sky[2]} stopOpacity="0" />
          <stop offset="0.75" stopColor={c.sky[2]} stopOpacity="0.5" />
          <stop offset="1" stopColor={c.sky[2]} stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}blur`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id={`${id}dof`}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}sky)`} />
      <motion.circle cx="1080" cy={sunY} r="420" fill={`url(#${id}sun)`} {...layer(0.05)} />
      {palette === 'night' && (
        <g fill="#fff">
          {Array.from({ length: 70 }, (_, i) => {
            const r = rng(i + 100)
            return <circle key={i} cx={r() * 1600} cy={r() * 420} r={r() * 1.4 + 0.3} opacity={0.3 + r() * 0.6} />
          })}
        </g>
      )}
      <motion.g {...layer(0.15)}>
        <path d={geo.far} fill={c.far} />
      </motion.g>
      <rect width="1600" height="860" fill={`url(#${id}haze)`} />
      <motion.g {...layer(0.3)}>
        <path d={geo.mid} fill={c.mid} />
        <path d={geo.treesBack} fill={c.trees} opacity="0.75" />
      </motion.g>
      {lake && (
        <g>
          <rect y="700" width="1600" height="200" fill={`url(#${id}lake)`} />
          <motion.g {...layer(0.3)} opacity="0.35" filter={`url(#${id}blur)`}>
            <path d={geo.mid} fill={c.mid} transform="translate(0 1400) scale(1 -1)" />
          </motion.g>
          <motion.ellipse cx="1080" cy="760" rx="260" ry="14" fill={c.sun} opacity="0.35" filter={`url(#${id}blur)`} {...layer(0.05)} />
        </g>
      )}
      <motion.g {...layer(0.6)}>
        <path d="M-300 830 C200 790 600 850 1000 815 C1400 785 1800 830 2200 810 L2200 1000 L-300 1000 Z" fill={c.ground} />
        <path d={geo.treesFront} fill={c.trees} filter={`url(#${id}dof)`} />
      </motion.g>
    </svg>
  )
})

/* ------------------------------------------------------------------ */

const HOUSE_COLORS = ['#7a2e3a', '#2f5a6b', '#c2873e', '#4c6b3c', '#6b4c8a', '#a8463a', '#2e4a7a', '#8a6a3a']

interface StreetProps {
  pan?: number
  duration?: number
  night?: boolean
  className?: string
}

/** Rua no estilo da Cidade Velha de Quebec: fachadas coloridas, neve e postes. */
export const Street = memo(function Street({ pan = 260, duration = 12, night = false, className = '' }: StreetProps) {
  const id = useSvgId()
  const houses = useMemo(() => {
    const r = rng(42)
    const list: { x: number; w: number; h: number; color: string; roof: 'gable' | 'flat' }[] = []
    let x = -200
    let i = 0
    while (x < 2300) {
      const w = 170 + r() * 90
      list.push({ x, w, h: 300 + r() * 160, color: HOUSE_COLORS[i % HOUSE_COLORS.length], roof: r() > 0.45 ? 'gable' : 'flat' })
      x += w + 6
      i++
    }
    return list
  }, [])

  return (
    <svg className={`scenery ${className}`} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? '#0a1020' : '#7f97b8'} />
          <stop offset="1" stopColor={night ? '#253350' : '#d6e2ee'} />
        </linearGradient>
        <radialGradient id={`${id}lamp`} cx="50%" cy="0%" r="100%">
          <stop offset="0" stopColor="#ffd59a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffd59a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}road`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? '#1e2638' : '#b9c6d6'} />
          <stop offset="1" stopColor={night ? '#0b0f18' : '#e9eff6'} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}sky)`} />
      <motion.g initial={{ x: 0 }} animate={{ x: -pan }} transition={{ duration, ease: 'linear' }}>
        {houses.map((hs, i) => {
          const top = 700 - hs.h
          return (
            <g key={i}>
              <rect x={hs.x} y={top} width={hs.w} height={hs.h} fill={hs.color} />
              <rect x={hs.x} y={top} width={hs.w} height={hs.h} fill="#000" opacity={night ? 0.45 : 0.08} />
              {hs.roof === 'gable' ? (
                <>
                  <path d={`M${hs.x - 8} ${top} L${hs.x + hs.w / 2} ${top - 90} L${hs.x + hs.w + 8} ${top} Z`} fill="#3a3f4a" />
                  <path d={`M${hs.x - 8} ${top} L${hs.x + hs.w / 2} ${top - 90} L${hs.x + hs.w + 8} ${top} L${hs.x + hs.w - 10} ${top - 10} L${hs.x + hs.w / 2} ${top - 76} L${hs.x + 10} ${top - 10} Z`} fill="#f4f8fc" />
                </>
              ) : (
                <rect x={hs.x - 6} y={top - 14} width={hs.w + 12} height="16" rx="6" fill="#f4f8fc" />
              )}
              {Array.from({ length: Math.floor(hs.h / 95) }, (_, row) =>
                [0, 1].map((col) => {
                  const lit = (i + row + col) % 3 !== 0
                  return (
                    <g key={`${row}-${col}`}>
                      <rect
                        x={hs.x + 28 + col * (hs.w - 90)}
                        y={top + 40 + row * 92}
                        width="36"
                        height="54"
                        rx="3"
                        fill={lit ? (night ? '#ffcf7a' : '#fbe6b8') : '#2a3242'}
                        opacity={lit ? 0.95 : 0.8}
                      />
                      <rect x={hs.x + 24 + col * (hs.w - 90)} y={top + 92 + row * 92} width="44" height="6" fill="#f4f8fc" />
                    </g>
                  )
                }),
              )}
              <rect x={hs.x + hs.w / 2 - 20} y={640} width="40" height="60" rx="4" fill="#1f1a18" />
            </g>
          )
        })}
        {Array.from({ length: 9 }, (_, i) => {
          const x = 60 + i * 280
          return (
            <g key={i}>
              <path d={`M${x - 120} 900 L${x - 18} 520 L${x + 18} 520 L${x + 120} 900 Z`} fill={`url(#${id}lamp)`} style={{ mixBlendMode: 'screen' }} />
              <rect x={x - 4} y="520" width="8" height="250" fill="#14161c" />
              <rect x={x - 16} y="500" width="32" height="26" rx="6" fill="#14161c" />
              <rect x={x - 10} y="506" width="20" height="16" rx="3" fill="#ffe3b0" />
              <circle cx={x} cy="514" r="34" fill="#ffd59a" opacity="0.25" />
            </g>
          )
        })}
      </motion.g>
      <rect y="700" width="1600" height="200" fill={`url(#${id}road)`} />
      <path d="M0 708 L1600 708" stroke="#f4f8fc" strokeWidth="14" />
      <rect y="770" width="1600" height="130" fill={night ? '#ffcf7a' : '#ffffff'} opacity="0.06" />
    </svg>
  )
})

/* ------------------------------------------------------------------ */

/** Céu acima das nuvens, com o avião atravessando. */
export const SkyFlight = memo(function SkyFlight({ className = '' }: { className?: string }) {
  const id = useSvgId()
  const clouds = (seed: number, y: number, count: number, scale: number) => {
    const r = rng(seed)
    return Array.from({ length: count }, (_, i) => ({ x: i * (2400 / count) + r() * 120 - 200, y: y + r() * 60, s: scale * (0.7 + r() * 0.6) }))
  }
  const far = useMemo(() => clouds(5, 520, 8, 1), [])
  const near = useMemo(() => clouds(9, 640, 6, 1.8), [])

  const cloud = (key: number, { x, y, s }: { x: number; y: number; s: number }, fill: string, blur?: boolean) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`} filter={blur ? `url(#${id}cblur)` : undefined}>
      <ellipse cx="0" cy="0" rx="120" ry="38" fill={fill} />
      <ellipse cx="-50" cy="-22" rx="60" ry="40" fill={fill} />
      <ellipse cx="40" cy="-34" rx="72" ry="52" fill={fill} />
      <ellipse cx="100" cy="-8" rx="50" ry="30" fill={fill} />
    </g>
  )

  return (
    <svg className={`scenery ${className}`} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24395c" />
          <stop offset="0.55" stopColor="#7e9cc2" />
          <stop offset="1" stopColor="#dfe8f2" />
        </linearGradient>
        <radialGradient id={`${id}sun`}>
          <stop offset="0" stopColor="#fff8ea" />
          <stop offset="0.2" stopColor="#ffeccc" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffeccc" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}cblur`}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`${id}mblur`}>
          <feGaussianBlur stdDeviation="14 2" />
        </filter>
        <linearGradient id={`${id}body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#aeb9c8" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}sky)`} />
      <circle cx="1240" cy="260" r="380" fill={`url(#${id}sun)`} />
      {/* Raios volumétricos */}
      <g opacity="0.16" style={{ mixBlendMode: 'screen' }}>
        {[-30, -12, 6, 22, 40].map((a, i) => (
          <path key={i} d="M1240 260 L-200 1100 L200 1100 Z" fill="#fff6e0" transform={`rotate(${a} 1240 260)`} />
        ))}
      </g>
      <motion.g initial={{ x: 0 }} animate={{ x: -500 }} transition={{ duration: 12, ease: 'linear' }}>
        {far.map((c, i) => cloud(i, c, '#f1f5fa', true))}
      </motion.g>
      {/* Avião */}
      <motion.g
        initial={{ x: -300, y: 520, rotate: -4 }}
        animate={{ x: [-300, 700, 1900], y: [520, 400, 300], rotate: [-4, -7, -9] }}
        transition={{ duration: 11, ease: 'easeInOut', times: [0, 0.55, 1] }}
      >
        <g transform="scale(1.1)">
          <path d="M-160 0 L-260 -6" stroke="#fff" strokeWidth="5" opacity="0.5" filter={`url(#${id}mblur)`} />
          <path d="M-120 14 L-380 20" stroke="#fff" strokeWidth="4" opacity="0.35" filter={`url(#${id}mblur)`} />
          <path d="M-130 -4 C-60 -18 80 -18 140 -6 C160 -2 160 8 140 12 C80 22 -60 20 -130 10 Z" fill={`url(#${id}body)`} />
          <path d="M-110 -6 L-150 -50 L-128 -50 L-80 -8 Z" fill="#c43d3d" />
          <path d="M-10 6 L-70 64 L-40 64 L40 8 Z" fill="#c9d2de" />
          <path d="M-10 -6 L-40 -34 L-24 -34 L20 -8 Z" fill="#9aa6b6" />
          <g fill="#2a3a52">
            {Array.from({ length: 10 }, (_, i) => (
              <rect key={i} x={-80 + i * 18} y="-6" width="8" height="6" rx="2" />
            ))}
          </g>
          <path d="M120 -8 C132 -6 140 -2 146 2 L124 2 Z" fill="#2a3a52" />
          {/* Folha de bordo estilizada na cauda */}
          <path d="M-134 -36 l4 -8 l2 6 l5 -3 l-2 7 l6 1 l-7 5 l1 4 l-9 -3 Z" fill="#fff" />
        </g>
      </motion.g>
      <motion.g initial={{ x: 0 }} animate={{ x: -1100 }} transition={{ duration: 12, ease: 'linear' }}>
        {near.map((c, i) => cloud(i, c, '#ffffff'))}
      </motion.g>
    </svg>
  )
})
