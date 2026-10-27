import { motion } from 'framer-motion'
import { Particles } from './Particles'
import { Landscape } from './Scenery'

interface IntroProps {
  onStart: (withSound: boolean) => void
}

const TITLE = 'Tarde Demais'

export function Intro({ onStart }: IntroProps) {
  return (
    <motion.section
      className="intro"
      aria-labelledby="intro-title"
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
      transition={{ duration: 1.2 }}
    >
      <motion.div className="layer" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 14, ease: 'easeOut' }}>
        <Landscape palette="night" pan={60} duration={40} sunY={200} />
      </motion.div>
      <Particles kind="snow" count={180} wind={0.25} />
      <div className="intro__shade" aria-hidden="true" />

      <div className="intro__content">
        <motion.p className="intro__kicker" initial={{ opacity: 0, letterSpacing: '0.8em' }} animate={{ opacity: 1, letterSpacing: '0.42em' }} transition={{ duration: 2, delay: 0.3 }}>
          Uma minissérie original
        </motion.p>
        <h1 id="intro-title" className="intro__title">
          <span className="sr-only">Tarde Demais: Amor em Quarentena</span>
          <span aria-hidden="true" className="intro__title-main">
            {TITLE.split(' ').map((word, w, words) => (
              <span key={w} className="intro__word">
                {Array.from(word).map((ch, i) => {
                  const n = words.slice(0, w).join(' ').length + i
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 0.8 + n * 0.07, duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      {ch}
                    </motion.span>
                  )
                })}
              </span>
            ))}
          </span>
          <motion.span aria-hidden="true" className="intro__title-sub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1.2 }}>
            Amor em Quarentena
          </motion.span>
        </h1>
        <motion.p className="intro__tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1.4 }}>
          Ela percebeu que amava ele. O problema é que ele já tinha superado.
        </motion.p>
        <motion.div className="intro__meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3, duration: 1 }}>
          <span className="badge">14</span>
          <span>Drama · Comédia ácida · 8 episódios · ~4 min</span>
        </motion.div>
        <motion.div className="intro__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.6, duration: 0.9 }}>
          <button type="button" className="btn btn--primary" onClick={() => onStart(true)} autoFocus>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
            </svg>
            Assistir com som
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => onStart(false)}>
            Assistir sem som
          </button>
        </motion.div>
        <motion.p className="intro__hint" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 4.2, duration: 1 }}>
          Espaço pausa · ← → trocam de cena · M liga/desliga o som
        </motion.p>
      </div>
    </motion.section>
  )
}
