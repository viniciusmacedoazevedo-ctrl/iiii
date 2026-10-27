import { createContext, useContext, useEffect, useRef } from 'react'

export interface SceneClock {
  /** Milissegundos desde o início da cena (pausa junto com a história). */
  t: number
  playing: boolean
  reduced: boolean
}

export const ClockContext = createContext<SceneClock>({ t: 0, playing: false, reduced: false })

export const useClock = () => useContext(ClockContext)

/** Texto "digitado" de forma determinística a partir do relógio da cena. */
export function typed(text: string, t: number, start: number, msPerChar = 45) {
  if (t < start) return ''
  const chars = Array.from(text)
  return chars.slice(0, Math.floor((t - start) / msPerChar)).join('')
}

/** Progresso 0..1 entre dois instantes. */
export function progress(t: number, start: number, end: number) {
  if (end <= start) return t >= end ? 1 : 0
  return Math.min(1, Math.max(0, (t - start) / (end - start)))
}

/**
 * Dispara `fn` uma única vez quando o relógio da cena cruza `at`.
 * Usado para efeitos sonoros e mudanças de trilha sincronizadas com a imagem.
 */
export function useCue(at: number, fn: () => void) {
  const { t } = useClock()
  const prev = useRef(-1)
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    if (prev.current < at && t >= at) fnRef.current()
    prev.current = t
  }, [t, at])
}
