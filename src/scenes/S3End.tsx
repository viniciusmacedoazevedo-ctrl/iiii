import { AnimatePresence, motion } from 'framer-motion'
import { Aside, Caption } from '../components/Caption'
import { Boy, Girl } from '../components/Characters'
import { Particles } from '../components/Particles'
import { Phone, type Message } from '../components/Phone'
import { Landscape } from '../components/Scenery'
import { ChapterTag, Shot } from '../components/Shot'
import { progress, useClock } from '../engine/clock'

type Timed = Message & { at: number }

const ENDING: Timed[] = [
  { at: 500, id: 'e0', from: 'them', text: 'fala comigo', time: '23:44' },
  { at: 1600, id: 'e1', from: 'me', text: 'Acabou, Lara.', time: '23:51', read: true },
  { at: 2800, id: 'e2', from: 'me', text: 'Eu te desejo o melhor. Só que longe de mim.', time: '23:51', read: true },
  { at: 4400, id: 'e3', from: 'system', text: 'Você arquivou esta conversa' },
]

const POLAROIDS = [
  { at: 7000, art: 'hockey', label: 'Primeira aula de hóquei (caiu 14 vezes)', x: -34, y: -14, r: -8 },
  { at: 8600, art: 'falls', label: 'Cataratas do Niágara', x: -6, y: -22, r: 5 },
  { at: 10200, art: 'friends', label: 'A turma nova do intercâmbio', x: 24, y: -10, r: -4 },
  { at: 11800, art: 'poutine', label: 'Poutine às 2h da manhã', x: -8, y: 20, r: 6 },
  { at: 13400, art: 'lake', label: 'Lago Louise, primavera', x: 22, y: 20, r: -6 },
] as const

const MONTHS = ['JANEIRO', 'FEVEREIRO', 'MARÇO']

function PolaroidArt({ art }: { art: (typeof POLAROIDS)[number]['art'] }) {
  switch (art) {
    case 'hockey':
      return (
        <svg viewBox="0 0 160 120" aria-hidden="true">
          <rect width="160" height="120" fill="#cfe6f5" />
          <ellipse cx="80" cy="96" rx="90" ry="30" fill="#eaf6ff" />
          <path d="M20 96 Q80 76 140 96" stroke="#d2475a" strokeWidth="3" fill="none" />
          <path d="M60 30 L76 90 L96 92" stroke="#3a2a1c" strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="104" cy="94" rx="8" ry="3" fill="#111" />
          <circle cx="48" cy="56" r="11" fill="#e9b892" />
          <path d="M37 54 C37 42 60 42 59 54 Z" fill="#c43d3d" />
          <path d="M34 92 L46 68 L58 92" fill="#2b4566" />
        </svg>
      )
    case 'falls':
      return (
        <svg viewBox="0 0 160 120" aria-hidden="true">
          <rect width="160" height="120" fill="#8fc0e6" />
          <path d="M0 40 L60 34 L60 120 L0 120 Z" fill="#4f6b3f" />
          <path d="M100 36 L160 40 L160 120 L100 120 Z" fill="#4f6b3f" />
          <path d="M60 34 L100 36 L104 120 L56 120 Z" fill="#e8f6ff" />
          <path d="M66 40 L68 120 M78 38 L80 120 M90 38 L92 120" stroke="#b7dcf4" strokeWidth="3" />
          <ellipse cx="80" cy="112" rx="50" ry="12" fill="#fff" opacity="0.8" />
          <path d="M20 30 Q80 -10 140 30" stroke="#ff9db0" strokeWidth="4" fill="none" opacity="0.7" />
          <path d="M24 32 Q80 -2 136 32" stroke="#ffe08a" strokeWidth="4" fill="none" opacity="0.7" />
        </svg>
      )
    case 'friends':
      return (
        <svg viewBox="0 0 160 120" aria-hidden="true">
          <rect width="160" height="120" fill="#f3d9b8" />
          {[
            ['#c98f6f', '#2a1a10', 30],
            ['#e9b892', '#22150e', 62],
            ['#8a5a3c', '#120b07', 96],
            ['#f6d2b2', '#e0b24a', 128],
          ].map(([skin, hair, x], i) => (
            <g key={i} transform={`translate(${x} ${i === 1 ? 54 : 60})`}>
              <path d="M-16 60 C-16 34 16 34 16 60 Z" fill={['#2b4566', '#c43d3d', '#3c6b4c', '#6b4c8a'][i]} />
              <circle r="14" fill={skin as string} />
              <path d="M-14 -2 C-14 -18 14 -18 14 -2 C8 -8 -8 -8 -14 -2 Z" fill={hair as string} />
              <path d="M-5 4 Q0 9 5 4" stroke="#5a2620" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      )
    case 'poutine':
      return (
        <svg viewBox="0 0 160 120" aria-hidden="true">
          <rect width="160" height="120" fill="#2a1f2e" />
          <circle cx="130" cy="22" r="10" fill="#ffe7a6" opacity="0.9" />
          <ellipse cx="80" cy="86" rx="56" ry="20" fill="#f4f1ea" />
          <ellipse cx="80" cy="80" rx="48" ry="16" fill="#e2a64a" />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={40 + i * 7} y={66 + (i % 3) * 4} width="5" height="18" rx="2" fill="#f2c45e" transform={`rotate(${(i % 2 ? 1 : -1) * 18} ${42 + i * 7} 74)`} />
          ))}
          <path d="M46 76 Q80 60 114 76 Q90 88 46 76 Z" fill="#7a3e1c" opacity="0.85" />
          <circle cx="66" cy="70" r="5" fill="#fff8e6" />
          <circle cx="92" cy="68" r="5" fill="#fff8e6" />
        </svg>
      )
    case 'lake':
      return (
        <svg viewBox="0 0 160 120" aria-hidden="true">
          <rect width="160" height="120" fill="#a8d4ee" />
          <path d="M0 70 L40 26 L70 60 L100 18 L160 70 Z" fill="#6c8aa0" />
          <path d="M34 34 L40 26 L46 34 Z M94 26 L100 18 L106 26 Z" fill="#fff" />
          <rect y="70" width="160" height="50" fill="#3fb6c2" />
          <path d="M0 70 L40 106 L70 80 L100 116 L160 70 Z" fill="#6c8aa0" opacity="0.35" />
          <path d="M10 70 l6 -18 l6 18 Z M130 70 l6 -22 l6 22 Z" fill="#21493a" />
        </svg>
      )
  }
}

export function S3End() {
  const { t } = useClock()
  const phase = t < 5800 ? 'end' : t < 17500 ? 'montage' : 'title'
  const thread = ENDING.filter((m) => t >= m.at)
  const season = progress(t, 6000, 16500)
  const dayIndex = Math.min(MONTHS.length - 1, Math.floor(season * MONTHS.length))
  const day = 1 + (Math.floor(season * 74) % 30)

  return (
    <div className="scene scene--end">
      <AnimatePresence>
        {phase === 'end' && (
          <Shot key="end" push={0.05} duration={6}>
            <div className="room room--night" />
            <div className="stage stage--split">
              <div className="stage__actor">
                <Boy mood={t < 3000 ? 'sad' : 'calm'} look={t < 4600 ? 'down' : 'right'} outfit="hoodie" rim="#8fb8ff" title="Ele, sério, encerrando o relacionamento" />
              </div>
              <div className="stage__device">
                <Phone label="Celular dele: mensagem de término" contact="Lara" status="visto por último às 23:44" avatar="👩🏻‍🦰" messages={thread} theme="cold" clock="23:51" />
              </div>
            </div>
          </Shot>
        )}
        {phase === 'montage' && (
          <Shot key="montage" push={0.04} duration={12}>
            <motion.div className="layer" initial={{ opacity: 1 }} animate={{ opacity: season > 0.5 ? 0 : 1 }} transition={{ duration: 2.4 }}>
              <Landscape palette="winter" pan={200} duration={12} />
            </motion.div>
            <motion.div className="layer" initial={{ opacity: 0 }} animate={{ opacity: season > 0.5 ? 1 : 0 }} transition={{ duration: 2.4 }}>
              <Landscape palette="spring" pan={200} duration={12} />
            </motion.div>
            <Particles key={season > 0.5 ? 'petals' : 'snow'} kind={season > 0.5 ? 'petals' : 'snow'} count={90} wind={0.5} />

            <div className="montage" role="list" aria-label="Montagem: a nova vida dele no Canadá">
              {POLAROIDS.filter((p) => t >= p.at).map((p) => (
                <motion.figure
                  key={p.art}
                  role="listitem"
                  className="polaroid"
                  style={{ left: `calc(50% + ${p.x}%)`, top: `calc(46% + ${p.y}%)` }}
                  initial={{ opacity: 0, scale: 1.8, rotate: p.r * 3, y: -80 }}
                  animate={{ opacity: 1, scale: 1, rotate: p.r, y: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                >
                  <PolaroidArt art={p.art} />
                  <figcaption>{p.label}</figcaption>
                </motion.figure>
              ))}
            </div>

            <div className="calendar" aria-label={`Calendário: ${MONTHS[dayIndex]}`}>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={MONTHS[dayIndex]}
                  className="calendar__month"
                  initial={{ rotateX: -90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: 90, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {MONTHS[dayIndex]}
                </motion.div>
              </AnimatePresence>
              <div className="calendar__day">{String(day).padStart(2, '0')}</div>
              <div className="calendar__season">{season > 0.5 ? 'primavera chegando' : 'inverno'}</div>
            </div>

            <motion.aside
              className="meanwhile"
              initial={{ opacity: 0, y: 30 }}
              animate={t > 9400 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.9 }}
            >
              <span className="meanwhile__label">Enquanto isso, no Brasil…</span>
              <Girl mood={t > 13000 ? 'teary' : 'sad'} look="down" outfit="sweater" className="meanwhile__girl" title="Ela, sozinha, percebendo o que perdeu" />
              <p>Ela relendo conversas antigas às 3h da manhã. Hobby novo.</p>
            </motion.aside>
          </Shot>
        )}
      </AnimatePresence>

      <ChapterTag show={t > 300 && t < 4800} number={3} title="O Fim" />
      <Aside show={t > 3600 && t < 5800} className="aside--top-right">
        Bloquear? Não. Arquivar com dignidade.
      </Aside>
      <motion.div className="blackout" animate={{ opacity: phase === 'title' ? 1 : 0 }} transition={{ duration: 1.2 }} aria-hidden="true" />
      <Caption show={phase === 'title'} text="Dois meses depois…" position="center" size="xl" className="caption--serif" />
    </div>
  )
}
