import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { score } from '../audio/score'
import './phone.css'

export interface Message {
  id: string
  from: 'me' | 'them' | 'system'
  text: string
  time?: string
  /** Mensagem com "foto" borrada (ficção, sem imagem real). */
  photo?: string
  read?: boolean
}

interface PhoneProps {
  contact: string
  status?: string
  avatar?: string
  messages: Message[]
  typing?: boolean
  theme?: 'night' | 'cold' | 'warm' | 'dusk'
  /** Texto sendo digitado pelo dono do celular (campo de texto). */
  draft?: string
  clock?: string
  className?: string
  label: string
}

export function Phone({
  contact,
  status,
  avatar = '🙂',
  messages,
  typing,
  theme = 'night',
  draft,
  clock = '23:41',
  className = '',
  label,
}: PhoneProps) {
  const count = useRef(messages.length)
  useEffect(() => {
    if (messages.length > count.current) {
      const last = messages[messages.length - 1]
      score.pop(last.from === 'me' ? 'me' : last.from === 'system' ? 'alert' : 'them')
    }
    count.current = messages.length
  }, [messages])

  return (
    <div className={`phone phone--${theme} ${className}`} role="group" aria-label={label}>
      <div className="phone__glass" aria-hidden="true" />
      <div className="phone__statusbar" aria-hidden="true">
        <span>{clock}</span>
        <span className="phone__island" />
        <span className="phone__icons">
          <i className="bars" />
          <i className="battery" />
        </span>
      </div>
      <header className="phone__header">
        <span className="phone__avatar" aria-hidden="true">
          {avatar}
        </span>
        <span className="phone__who">
          <strong>{contact}</strong>
          <AnimatePresence mode="wait">
            <motion.small
              key={typing ? 'typing' : status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              {typing ? 'digitando…' : status}
            </motion.small>
          </AnimatePresence>
        </span>
      </header>
      <div className="phone__thread" role="log" aria-live="polite" aria-relevant="additions">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              layout="position"
              className={`bubble bubble--${m.from}`}
              initial={{ opacity: 0, y: 18, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              style={{ transformOrigin: m.from === 'me' ? '100% 100%' : '0% 100%' }}
            >
              {m.photo && (
                <span className="bubble__photo" aria-label={`Foto: ${m.photo}`}>
                  <span className="bubble__photo-blur" aria-hidden="true" />
                  <span className="bubble__photo-tag">{m.photo}</span>
                </span>
              )}
              {m.text && <span className="bubble__text">{m.text}</span>}
              {m.time && (
                <span className="bubble__time" aria-hidden="true">
                  {m.time}
                  {m.from === 'me' && <span className={m.read ? 'ticks ticks--read' : 'ticks'}>✓✓</span>}
                </span>
              )}
            </motion.div>
          ))}
          {typing && (
            <motion.div
              key="typing"
              layout="position"
              className="bubble bubble--them bubble--typing"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              aria-label={`${contact} está digitando`}
            >
              <span />
              <span />
              <span />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="phone__composer" aria-hidden={draft === undefined}>
        <span className={`phone__input ${draft ? 'has-text' : ''}`}>
          {draft || 'Mensagem'}
          {draft !== undefined && draft.length > 0 && <i className="caret" />}
        </span>
        <span className="phone__send">➤</span>
      </div>
    </div>
  )
}
