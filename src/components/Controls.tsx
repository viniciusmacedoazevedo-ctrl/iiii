import { motion } from 'framer-motion'

interface ChapterInfo {
  id: string
  title: string
}

interface ControlsProps {
  chapters: ChapterInfo[]
  index: number
  /** Progresso 0..1 da cena atual. */
  progress: number
  playing: boolean
  muted: boolean
  visible: boolean
  onToggle: () => void
  onPrev: () => void
  onNext: () => void
  onSeek: (index: number) => void
  onMute: () => void
  onRestart: () => void
}

export function Controls({ chapters, index, progress, playing, muted, visible, onToggle, onPrev, onNext, onSeek, onMute, onRestart }: ControlsProps) {
  return (
    <motion.nav
      className="controls"
      aria-label="Controles da história"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.4 }}
    >
      <ol className="controls__chapters">
        {chapters.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              className={`chapter ${i === index ? 'is-current' : ''} ${i < index ? 'is-done' : ''}`}
              onClick={() => onSeek(i)}
              aria-label={`Ir para o episódio ${i + 1}: ${c.title}`}
              aria-current={i === index ? 'step' : undefined}
            >
              <span className="chapter__bar">
                <i style={{ transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})` }} />
              </span>
              <span className="chapter__label">{c.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="controls__row">
        <span className="controls__now" aria-live="polite">
          <b>{index < chapters.length - 1 ? `Ep. ${index + 1}` : 'Créditos'}</b> {chapters[index]?.title}
        </span>
        <div className="controls__buttons">
          <button type="button" className="icon-btn" onClick={onRestart} aria-label="Recomeçar a história" title="Recomeçar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="icon-btn" onClick={onPrev} disabled={index === 0} aria-label="Cena anterior (seta para a esquerda)" title="Anterior (←)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 5v14M19 5l-10 7 10 7z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="icon-btn icon-btn--main" onClick={onToggle} aria-label={playing ? 'Pausar (espaço)' : 'Continuar (espaço)'} title={playing ? 'Pausar (espaço)' : 'Continuar (espaço)'}>
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
              </svg>
            )}
          </button>
          <button type="button" className="icon-btn" onClick={onNext} disabled={index >= chapters.length - 1} aria-label="Próxima cena (seta para a direita)" title="Próxima (→)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 5v14M5 5l10 7-10 7z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="icon-btn" onClick={onMute} aria-label={muted ? 'Ativar som (M)' : 'Desativar som (M)'} aria-pressed={!muted} title={muted ? 'Ativar som (M)' : 'Silenciar (M)'}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />
              {muted ? (
                <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
