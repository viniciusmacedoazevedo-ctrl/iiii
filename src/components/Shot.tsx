import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ShotProps {
  children: ReactNode
  className?: string
  /** Movimento de câmera durante o plano: zoom lento e leve deriva. */
  push?: number
  drift?: number
  duration?: number
}

/** Um "plano" de câmera: entra com zoom e desfoque, sai com fade. */
export function Shot({ children, className = '', push = 0.06, drift = 0, duration = 8 }: ShotProps) {
  return (
    <motion.div
      className={`shot ${className}`}
      initial={{ opacity: 0, filter: 'blur(16px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="shot__camera"
        initial={{ scale: 1 + push, x: 0 }}
        animate={{ scale: 1, x: drift }}
        transition={{ duration, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export function ChapterTag({ show, number, title }: { show: boolean; number: number; title: string }) {
  return (
    <motion.div
      className="chapter-tag"
      initial={{ opacity: 0, x: -20 }}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      aria-hidden={!show}
    >
      <span className="chapter-tag__n">Episódio {number}</span>
      <span className="chapter-tag__t">{title}</span>
    </motion.div>
  )
}

export function LocationTag({ show, place, detail }: { show: boolean; place: string; detail?: string }) {
  return (
    <motion.div
      className="location-tag"
      initial={{ opacity: 0, letterSpacing: '0.6em' }}
      animate={show ? { opacity: 1, letterSpacing: '0.32em' } : { opacity: 0 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      <strong>{place}</strong>
      {detail && <span>{detail}</span>}
    </motion.div>
  )
}
