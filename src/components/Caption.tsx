import { AnimatePresence, motion } from 'framer-motion'

interface CaptionProps {
  show: boolean
  text: string
  position?: 'bottom' | 'center' | 'top'
  size?: 'md' | 'lg' | 'xl'
  className?: string
}

/** Texto de narração com entrada palavra por palavra (desfoque → foco). */
export function Caption({ show, text, position = 'bottom', size = 'md', className = '' }: CaptionProps) {
  const words = text.split(' ')
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          key={text}
          className={`caption caption--${position} caption--${size} ${className}`}
          aria-live="polite"
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.8 } }}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="caption__word"
              variants={{
                hidden: { opacity: 0, y: 14, filter: 'blur(10px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.2, 0.7, 0.2, 1] } },
              }}
            >
              {w}{' '}
            </motion.span>
          ))}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

/** Nota de rodapé com humor ácido, estilo "comentário do narrador". */
export function Aside({ show, children, className = '' }: { show: boolean; children: React.ReactNode; className?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`aside ${className}`}
          initial={{ opacity: 0, x: -16, rotate: -2 }}
          animate={{ opacity: 1, x: 0, rotate: -2 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
