import { motion } from 'framer-motion'
import { useId } from 'react'

/*
 * Personagens fictícios em ilustração vetorial "3D estilizada":
 * gradientes radiais para volume, luz de recorte e expressões que se
 * transformam de forma contínua (as curvas compartilham a mesma estrutura,
 * então o Framer Motion consegue interpolar entre elas).
 */

const useSvgId = () => useId().replace(/[^a-zA-Z0-9_-]/g, '')

const spring = { type: 'spring', stiffness: 140, damping: 18 } as const

type Look = 'center' | 'down' | 'left' | 'right' | 'up'
const LOOK: Record<Look, [number, number]> = {
  center: [0, 0],
  down: [0, 3.5],
  left: [-3.5, 0.5],
  right: [3.5, 0.5],
  up: [0.5, -3],
}

/* ------------------------------------------------------------------ */
/* Ele                                                                 */
/* ------------------------------------------------------------------ */

export type BoyMood = 'neutral' | 'happy' | 'confident' | 'shocked' | 'sad' | 'angry' | 'thinking' | 'calm'

interface Face {
  browL: string
  browR: string
  mouth: string
  eyeRy: number
  mouthOpen?: boolean
}

const BOY_FACES: Record<BoyMood, Face> = {
  neutral: { browL: 'M90 104 Q101 99 112 103', browR: 'M128 103 Q139 99 150 104', mouth: 'M108 160 Q120 163 132 160', eyeRy: 8 },
  happy: { browL: 'M90 102 Q101 96 112 101', browR: 'M128 101 Q139 96 150 102', mouth: 'M105 157 Q120 171 135 157', eyeRy: 7 },
  confident: { browL: 'M90 103 Q101 99 112 104', browR: 'M128 101 Q139 95 150 101', mouth: 'M107 160 Q123 167 135 155', eyeRy: 6.5 },
  shocked: { browL: 'M90 96 Q101 89 112 95', browR: 'M128 95 Q139 89 150 96', mouth: 'M112 160 Q120 160 128 160', eyeRy: 9.5, mouthOpen: true },
  sad: { browL: 'M90 104 Q102 103 112 97', browR: 'M128 97 Q138 103 150 104', mouth: 'M108 163 Q120 155 132 163', eyeRy: 6.5 },
  angry: { browL: 'M90 99 Q102 102 112 107', browR: 'M128 107 Q138 102 150 99', mouth: 'M108 162 Q120 158 132 162', eyeRy: 6 },
  thinking: { browL: 'M90 101 Q101 97 112 102', browR: 'M128 104 Q139 102 150 105', mouth: 'M110 161 Q121 162 131 158', eyeRy: 7 },
  calm: { browL: 'M90 103 Q101 99 112 103', browR: 'M128 103 Q139 99 150 103', mouth: 'M107 159 Q120 166 133 159', eyeRy: 5.5 },
}

export type BoyOutfit = 'parka' | 'coat' | 'hoodie'

interface BoyProps {
  mood?: BoyMood
  outfit?: BoyOutfit
  look?: Look
  /** Intensidade da luz de recorte (0..1) e sua cor. */
  rim?: string
  className?: string
  title?: string
}

export function Boy({ mood = 'neutral', outfit = 'parka', look = 'center', rim = '#9cc8ff', className, title }: BoyProps) {
  const id = useSvgId()
  const face = BOY_FACES[mood]
  const [lx, ly] = LOOK[look]
  const outfitColors: Record<BoyOutfit, [string, string]> = {
    parka: ['#2f4a6b', '#152338'],
    coat: ['#b48a5e', '#6b4a2c'],
    hoodie: ['#3b3f4c', '#1c1f27'],
  }
  const [o1, o2] = outfitColors[outfit]

  return (
    <svg viewBox="0 0 240 300" className={className} role="img" aria-label={title ?? 'Ele'}>
      <defs>
        <radialGradient id={`${id}skin`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#f6d2b2" />
          <stop offset="0.55" stopColor="#e4b18c" />
          <stop offset="1" stopColor="#b97e5b" />
        </radialGradient>
        <linearGradient id={`${id}neck`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8704f" />
          <stop offset="1" stopColor="#d9a481" />
        </linearGradient>
        <linearGradient id={`${id}hair`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a3022" />
          <stop offset="0.5" stopColor="#24160f" />
          <stop offset="1" stopColor="#120b07" />
        </linearGradient>
        <linearGradient id={`${id}cloth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={o1} />
          <stop offset="1" stopColor={o2} />
        </linearGradient>
        <radialGradient id={`${id}iris`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#8a5a33" />
          <stop offset="1" stopColor="#2e1a0e" />
        </radialGradient>
        <linearGradient id={`${id}rim`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor={rim} stopOpacity="0.85" />
          <stop offset="0.25" stopColor={rim} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Corpo */}
      <g transform="translate(0 -22)">
      <path d="M18 330 L18 300 C22 250 60 224 120 222 C180 224 218 250 222 300 L222 330 Z" fill={`url(#${id}cloth)`} />
      <path d="M18 330 L18 300 C22 250 60 224 120 222 C180 224 218 250 222 300 L222 330 Z" fill={`url(#${id}rim)`} />
      {outfit === 'parka' && (
        <>
          <path d="M70 236 C84 206 156 206 170 236 C150 226 90 226 70 236 Z" fill="#d8d2c4" opacity="0.92" />
          <path d="M120 232 L120 330" stroke="#0d1726" strokeWidth="3" />
          <path d="M60 262 L82 262" stroke="#0d1726" strokeWidth="2" opacity="0.6" />
        </>
      )}
      {outfit === 'coat' && (
        <>
          <path d="M98 214 C104 230 136 230 142 214 L146 236 C132 246 108 246 94 236 Z" fill="#1d1d22" />
          <path d="M86 232 L120 330 L72 330 C70 280 74 248 86 232 Z" fill="#9a734c" />
          <path d="M154 232 L120 330 L168 330 C170 280 166 248 154 232 Z" fill="#9a734c" />
          <circle cx="132" cy="276" r="3" fill="#2a1b10" />
        </>
      )}
      {outfit === 'hoodie' && (
        <path d="M84 230 C96 250 144 250 156 230" fill="none" stroke="#0f1116" strokeWidth="4" strokeLinecap="round" />
      )}
      </g>

      {/* Pescoço */}
      <rect x="103" y="164" width="34" height="44" rx="14" fill={`url(#${id}neck)`} />
      <path d="M103 184 Q120 198 137 184 L137 196 Q120 206 103 196 Z" fill="#8a5a3c" opacity="0.35" />

      <motion.g
        animate={{ rotate: [0, 1.2, 0, -0.8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 90%' }}
      >
        {/* Orelhas */}
        <ellipse cx="75" cy="126" rx="8" ry="13" fill="#d49c78" />
        <ellipse cx="165" cy="126" rx="8" ry="13" fill="#d49c78" />
        {/* Cabeça */}
        <path
          d="M76 108 C76 70 96 56 120 56 C144 56 164 70 164 108 C164 150 150 178 120 182 C90 178 76 150 76 108 Z"
          fill={`url(#${id}skin)`}
        />
        <path
          d="M164 108 C164 150 150 178 120 182 C140 172 154 150 156 112 Z"
          fill={rim}
          opacity="0.22"
        />
        {/* Bochechas */}
        <ellipse cx="96" cy="146" rx="9" ry="5" fill="#e98f7a" opacity={mood === 'happy' || mood === 'calm' ? 0.35 : 0.15} />
        <ellipse cx="144" cy="146" rx="9" ry="5" fill="#e98f7a" opacity={mood === 'happy' || mood === 'calm' ? 0.35 : 0.15} />

        {/* Cabelo */}
        <path
          d="M72 116 C64 70 90 42 124 42 C154 42 176 62 170 112 C166 92 160 82 152 76 C138 88 112 90 94 80 C86 92 78 102 76 120 Z"
          fill={`url(#${id}hair)`}
        />
        <path d="M90 66 C98 30 146 24 164 54 C150 44 128 44 112 58 C104 52 96 56 90 66 Z" fill="#2c1b12" />
        <path d="M104 50 C118 38 140 38 152 48" fill="none" stroke="#7a5238" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <path d="M96 70 C108 58 126 56 140 60 C128 64 116 72 108 84 C106 76 100 72 96 70 Z" fill="#3a2418" />
        <path d="M76 104 C76 116 78 124 80 132 L84 132 C82 120 82 110 84 100 Z" fill="#24160f" />
        <path d="M164 104 C164 116 162 124 160 132 L156 132 C158 120 158 110 156 100 Z" fill="#24160f" />

        {/* Olhos */}
        {[102, 138].map((cx) => (
          <motion.g
            key={cx}
            animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
            transition={{ duration: 4.6, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <motion.ellipse cx={cx} cy="122" rx="9.5" fill="#fbf7f2" animate={{ ry: face.eyeRy }} transition={spring} />
            <motion.g animate={{ x: lx, y: ly }} transition={spring}>
              <circle cx={cx} cy="122" r="5.8" fill={`url(#${id}iris)`} />
              <circle cx={cx} cy="122" r="2.8" fill="#0b0604" />
              <circle cx={cx - 2} cy="119.6" r="1.7" fill="#fff" />
            </motion.g>
            <motion.path
              d={`M${cx - 10} 120 Q${cx} 111 ${cx + 10} 120`}
              fill="none"
              stroke="#2a170e"
              strokeWidth="2.4"
              strokeLinecap="round"
              animate={{ y: 8 - face.eyeRy }}
              transition={spring}
            />
          </motion.g>
        ))}

        {/* Sobrancelhas */}
        <motion.path animate={{ d: face.browL }} transition={spring} fill="none" stroke="#24160f" strokeWidth="4.2" strokeLinecap="round" />
        <motion.path animate={{ d: face.browR }} transition={spring} fill="none" stroke="#24160f" strokeWidth="4.2" strokeLinecap="round" />

        {/* Nariz */}
        <path d="M121 126 Q115 143 123 146" fill="none" stroke="#a96d4c" strokeWidth="2.4" strokeLinecap="round" />

        {/* Boca */}
        {face.mouthOpen ? (
          <motion.ellipse
            cx="120"
            cy="162"
            rx="7"
            ry="9"
            fill="#5a2620"
            initial={{ ry: 1 }}
            animate={{ ry: 8 }}
            transition={spring}
          />
        ) : (
          <motion.path
            animate={{ d: face.mouth }}
            transition={spring}
            fill="none"
            stroke="#8e4436"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        )}
      </motion.g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Ela                                                                 */
/* ------------------------------------------------------------------ */

export type GirlMood = 'neutral' | 'sad' | 'sick' | 'thinking' | 'nervous' | 'hopeful' | 'smile' | 'teary' | 'idea'

const GIRL_FACES: Record<GirlMood, Face> = {
  neutral: { browL: 'M90 103 Q101 99 112 102', browR: 'M128 102 Q139 99 150 103', mouth: 'M110 162 Q120 165 130 162', eyeRy: 9 },
  sad: { browL: 'M90 103 Q102 102 112 97', browR: 'M128 97 Q138 102 150 103', mouth: 'M110 165 Q120 158 130 165', eyeRy: 7.5 },
  sick: { browL: 'M90 104 Q102 103 112 100', browR: 'M128 100 Q138 103 150 104', mouth: 'M110 164 Q120 161 130 165', eyeRy: 5 },
  thinking: { browL: 'M90 100 Q101 95 112 100', browR: 'M128 102 Q139 100 150 104', mouth: 'M111 163 Q121 164 130 160', eyeRy: 8.5 },
  nervous: { browL: 'M90 101 Q102 98 112 96', browR: 'M128 96 Q138 98 150 101', mouth: 'M110 163 Q115 160 120 163', eyeRy: 9.5 },
  hopeful: { browL: 'M90 99 Q101 94 112 98', browR: 'M128 98 Q139 94 150 99', mouth: 'M110 161 Q120 167 130 161', eyeRy: 9.5 },
  smile: { browL: 'M90 101 Q101 96 112 100', browR: 'M128 100 Q139 96 150 101', mouth: 'M108 159 Q120 170 132 159', eyeRy: 7 },
  teary: { browL: 'M90 102 Q102 101 112 95', browR: 'M128 95 Q138 101 150 102', mouth: 'M110 165 Q120 160 130 165', eyeRy: 8 },
  idea: { browL: 'M90 96 Q101 90 112 95', browR: 'M128 95 Q139 90 150 96', mouth: 'M112 162 Q120 162 128 162', eyeRy: 10, mouthOpen: true },
}

const SPOTS: [number, number, number][] = [
  [94, 138, 2.6], [104, 150, 2], [148, 140, 2.8], [140, 152, 2.1], [116, 92, 2.2],
  [132, 84, 1.8], [88, 120, 1.8], [154, 122, 2], [124, 176, 2.2], [100, 172, 1.7], [143, 168, 1.9],
]

interface GirlProps {
  mood?: GirlMood
  look?: Look
  spots?: boolean
  outfit?: 'pajama' | 'sweater'
  rim?: string
  className?: string
  title?: string
}

export function Girl({ mood = 'neutral', look = 'center', spots = false, outfit = 'sweater', rim = '#ffb9a0', className, title }: GirlProps) {
  const id = useSvgId()
  const face = GIRL_FACES[mood]
  const [lx, ly] = LOOK[look]
  const [o1, o2] = outfit === 'pajama' ? ['#b9a3d6', '#7a64a0'] : ['#8a3b4e', '#4d1d2b']

  return (
    <svg viewBox="0 0 240 300" className={className} role="img" aria-label={title ?? 'Ela'}>
      <defs>
        <radialGradient id={`${id}skin`} cx="40%" cy="32%" r="75%">
          <stop offset="0" stopColor="#fbe0cb" />
          <stop offset="0.6" stopColor="#efc1a2" />
          <stop offset="1" stopColor="#c98f6f" />
        </radialGradient>
        <linearGradient id={`${id}hair`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b4a2a" />
          <stop offset="0.5" stopColor="#6d2f19" />
          <stop offset="1" stopColor="#3e190c" />
        </linearGradient>
        <linearGradient id={`${id}cloth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={o1} />
          <stop offset="1" stopColor={o2} />
        </linearGradient>
        <radialGradient id={`${id}iris`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#6c8a4f" />
          <stop offset="1" stopColor="#2a3a1c" />
        </radialGradient>
      </defs>

      {/* Cabelo de trás */}
      <path d="M66 110 C60 60 94 40 122 40 C154 40 184 62 176 116 C182 170 188 220 170 250 L70 250 C52 220 60 170 66 110 Z" fill={`url(#${id}hair)`} />

      {/* Corpo */}
      <g transform="translate(0 -22)">
      <path d="M26 330 L26 300 C30 252 64 228 120 226 C176 228 210 252 214 300 L214 330 Z" fill={`url(#${id}cloth)`} />
      {outfit === 'pajama' && (
        <g fill="#fff" opacity="0.35">
          <circle cx="70" cy="270" r="4" />
          <circle cx="104" cy="288" r="4" />
          <circle cx="150" cy="262" r="4" />
          <circle cx="182" cy="286" r="4" />
          <circle cx="126" cy="252" r="4" />
        </g>
      )}
      {outfit === 'sweater' && <path d="M92 232 C104 246 136 246 148 232" fill="none" stroke="#3a1520" strokeWidth="5" strokeLinecap="round" />}
      </g>

      <rect x="105" y="166" width="30" height="42" rx="13" fill="#d9a585" />

      <motion.g
        animate={{ rotate: mood === 'sick' ? [0, -2, 0, -1.5, 0] : [0, -1, 0, 0.8, 0] }}
        transition={{ duration: mood === 'sick' ? 5 : 7.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 90%' }}
      >
        <ellipse cx="77" cy="128" rx="7" ry="12" fill="#e2ad8d" />
        <ellipse cx="163" cy="128" rx="7" ry="12" fill="#e2ad8d" />
        <path d="M78 110 C78 72 98 58 120 58 C142 58 162 72 162 110 C162 150 148 176 120 180 C92 176 78 150 78 110 Z" fill={`url(#${id}skin)`} />
        <path d="M162 110 C162 150 148 176 120 180 C138 170 152 150 154 114 Z" fill={rim} opacity="0.2" />

        <ellipse cx="96" cy="146" rx="10" ry="6" fill="#ef8f86" opacity={mood === 'sick' ? 0.5 : mood === 'smile' || mood === 'hopeful' ? 0.4 : 0.22} />
        <ellipse cx="144" cy="146" rx="10" ry="6" fill="#ef8f86" opacity={mood === 'sick' ? 0.5 : mood === 'smile' || mood === 'hopeful' ? 0.4 : 0.22} />

        {/* Catapora: sinais discretos, não gráficos */}
        {spots &&
          SPOTS.map(([cx, cy, r], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="#e2707a"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.62, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 300, damping: 14 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          ))}

        {/* Franja */}
        <path d="M74 112 C70 64 104 44 128 46 C156 48 172 72 166 108 C160 84 146 72 130 68 C118 86 96 98 74 112 Z" fill={`url(#${id}hair)`} />
        <path d="M100 58 C116 48 140 48 154 60" fill="none" stroke="#c46a3e" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

        {[102, 138].map((cx) => (
          <motion.g
            key={cx}
            animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
            transition={{ duration: 5.2, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1], delay: 0.8 }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <motion.ellipse cx={cx} cy="124" rx="9.5" fill="#fdf9f5" animate={{ ry: face.eyeRy }} transition={spring} />
            <motion.g animate={{ x: lx, y: ly }} transition={spring}>
              <circle cx={cx} cy="124" r="6.2" fill={`url(#${id}iris)`} />
              <circle cx={cx} cy="124" r="3" fill="#0b0604" />
              <circle cx={cx - 2.2} cy="121.4" r="1.9" fill="#fff" />
            </motion.g>
            <motion.path
              d={`M${cx - 11} 122 Q${cx} 112 ${cx + 11} 122 M${cx + (cx < 120 ? -11 : 11)} 122 l${cx < 120 ? -4 : 4} -3`}
              fill="none"
              stroke="#2a130b"
              strokeWidth="2.6"
              strokeLinecap="round"
              animate={{ y: 9 - face.eyeRy }}
              transition={spring}
            />
          </motion.g>
        ))}

        {(mood === 'teary' || mood === 'sad') && (
          <motion.path
            d="M96 134 q-3 7 0 10 q3 -3 0 -10 Z"
            fill="#a9dcff"
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: [0, 22], opacity: [0, 0.9, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.8, ease: 'easeIn' }}
          />
        )}

        <motion.path animate={{ d: face.browL }} transition={spring} fill="none" stroke="#5a2412" strokeWidth="3.4" strokeLinecap="round" />
        <motion.path animate={{ d: face.browR }} transition={spring} fill="none" stroke="#5a2412" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M121 130 Q117 143 123 145" fill="none" stroke="#c48a6a" strokeWidth="2.2" strokeLinecap="round" />

        {face.mouthOpen ? (
          <motion.ellipse cx="120" cy="163" rx="6" fill="#7a2a2a" initial={{ ry: 1 }} animate={{ ry: 6.5 }} transition={spring} />
        ) : (
          <motion.path animate={{ d: face.mouth }} transition={spring} fill="none" stroke="#b54a4a" strokeWidth="3.4" strokeLinecap="round" />
        )}
      </motion.g>

      {/* Mechas da frente sobre os ombros */}
      <path d="M70 140 C62 186 70 220 86 244 C74 218 74 186 80 150 Z" fill="#5a2614" />
      <path d="M170 140 C178 186 170 220 154 244 C166 218 166 186 160 150 Z" fill="#5a2614" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Silhueta caminhando (planos abertos)                                */
/* ------------------------------------------------------------------ */

interface WalkerProps {
  walking?: boolean
  outfit?: 'parka' | 'coat'
  pose?: 'free' | 'phone' | 'pocket'
  className?: string
  title?: string
}

export function Walker({ walking = true, outfit = 'parka', pose = 'free', className, title }: WalkerProps) {
  const coat = outfit === 'parka' ? '#2b4566' : '#a57d52'
  const coatDark = outfit === 'parka' ? '#17263a' : '#6b4a2c'
  const swing = walking ? { rotate: [16, -16, 16] } : { rotate: 0 }
  const swingR = walking ? { rotate: [-16, 16, -16] } : { rotate: 0 }
  const step = { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } as const

  return (
    <motion.svg
      viewBox="0 0 60 150"
      className={className}
      role="img"
      aria-label={title ?? 'Ele caminhando'}
      animate={walking ? { y: [0, -1.6, 0, -1.6, 0] } : { y: 0 }}
      transition={step}
    >
      <ellipse cx="30" cy="147" rx="16" ry="2.6" fill="#000" opacity="0.28" />
      {/* Pernas */}
      <motion.g animate={swing} transition={step} style={{ transformBox: 'fill-box', transformOrigin: '50% 0%' }}>
        <rect x="23" y="92" width="7" height="50" rx="3.5" fill="#1b1d24" />
        <rect x="21" y="138" width="11" height="7" rx="3" fill="#0d0e12" />
      </motion.g>
      <motion.g animate={swingR} transition={step} style={{ transformBox: 'fill-box', transformOrigin: '50% 0%' }}>
        <rect x="31" y="92" width="7" height="50" rx="3.5" fill="#24262e" />
        <rect x="29" y="138" width="11" height="7" rx="3" fill="#121318" />
      </motion.g>
      {/* Braço de trás */}
      <motion.g
        animate={pose === 'free' ? swing : { rotate: 0 }}
        transition={step}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 5%' }}
      >
        <rect x="14" y="48" width="8" height="40" rx="4" fill={coatDark} />
      </motion.g>
      {/* Tronco */}
      <path d="M17 48 C17 40 43 40 43 48 L45 100 L15 100 Z" fill={coat} />
      <path d="M30 46 L30 100" stroke={coatDark} strokeWidth="1.2" />
      <path d="M20 44 C24 50 36 50 40 44 L40 40 C34 44 26 44 20 40 Z" fill={outfit === 'parka' ? '#d9d2c3' : '#1d1d22'} />
      {/* Braço da frente */}
      {pose === 'phone' ? (
        <g>
          <path d="M40 50 L46 70 L38 72" fill="none" stroke={coat} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="33" y="62" width="7" height="11" rx="1.5" fill="#0d0f14" />
          <rect x="34" y="63" width="5" height="8" rx="1" fill="#8fc0ff" opacity="0.9" />
        </g>
      ) : pose === 'pocket' ? (
        <path d="M40 50 L44 74 L38 84" fill="none" stroke={coat} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <motion.g animate={swingR} transition={step} style={{ transformBox: 'fill-box', transformOrigin: '50% 5%' }}>
          <rect x="38" y="48" width="8" height="40" rx="4" fill={coat} />
          <circle cx="42" cy="89" r="3.6" fill="#e2b08b" />
        </motion.g>
      )}
      {/* Cabeça */}
      <rect x="26" y="32" width="8" height="10" rx="3" fill="#c48c69" />
      <ellipse cx="30" cy="24" rx="10" ry="12" fill="#e9b892" />
      <path d="M19 24 C17 10 26 6 32 6 C40 6 44 12 41 22 C39 16 34 14 28 15 C24 16 21 19 19 24 Z" fill="#22150e" />
      <circle cx="26.4" cy="24.5" r="1.2" fill="#1a0f0a" />
      <circle cx="33.6" cy="24.5" r="1.2" fill="#1a0f0a" />
      <path d="M24.6 21.6 L28 21 M32 21 L35.4 21.6" stroke="#22150e" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M27.2 29.4 Q30 31.6 32.8 29.4" fill="none" stroke="#8e4436" strokeWidth="0.9" strokeLinecap="round" />
      <ellipse cx="25" cy="28" rx="1.6" ry="0.9" fill="#e98f7a" opacity="0.4" />
      <ellipse cx="35" cy="28" rx="1.6" ry="0.9" fill="#e98f7a" opacity="0.4" />
      <path d="M38 20 C40 22 40 28 38 31" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.4" />
    </motion.svg>
  )
}
