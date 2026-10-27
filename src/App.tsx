import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { score } from './audio/score'
import { Controls } from './components/Controls'
import { Intro } from './components/Intro'
import { ClockContext } from './engine/clock'
import { CREDITS_DURATION, SCENES } from './scenes'
import { Credits } from './scenes/Credits'

const CHAPTERS = [...SCENES.map(({ id, title }) => ({ id, title })), { id: 'creditos', title: 'Créditos' }]
const LAST = CHAPTERS.length - 1
const durationOf = (i: number) => (i < SCENES.length ? SCENES[i].duration : CREDITS_DURATION)
/** O relógio da cena avança em passos de 50 ms: suave para a narrativa, leve para o React. */
const TICK = 50

export function App() {
  const reduced = useReducedMotion() ?? false
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [uiVisible, setUiVisible] = useState(true)
  const elapsed = useRef(0)
  const hideTimer = useRef<number | undefined>(undefined)

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(LAST, i))
    elapsed.current = 0
    setT(0)
    setIndex(next)
    score.whoosh()
    // Passa pelo silêncio para que reentrar na mesma cena reinicie a trilha (e o crescendo).
    score.setMood('silence')
    score.setMood(next < SCENES.length ? SCENES[next].mood : 'finale')
  }, [])

  // Relógio narrativo: pausa junto com a história e avança as cenas sozinho.
  useEffect(() => {
    if (!started || !playing) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      elapsed.current += Math.min(250, now - last)
      last = now
      const q = Math.floor(elapsed.current / TICK) * TICK
      setT((prev) => (prev === q ? prev : q))
      if (elapsed.current >= durationOf(index) && index < LAST) {
        goTo(index + 1)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [started, playing, index, goTo])

  useEffect(() => {
    if (!started) return
    if (playing) score.resume()
    else score.pause()
  }, [playing, started])

  // Pausa automática quando a aba sai de foco.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setPlaying(false)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const start = (withSound: boolean) => {
    score.start()
    score.setMuted(!withSound)
    setMuted(!withSound)
    setStarted(true)
    setPlaying(true)
    goTo(0)
  }

  const toggle = useCallback(() => setPlaying((p) => !p), [])
  const toggleMute = useCallback(() => {
    setMuted((m) => {
      score.start()
      score.setMuted(!m)
      return !m
    })
  }, [])
  const restart = useCallback(() => {
    setPlaying(true)
    goTo(0)
  }, [goTo])
  const seek = useCallback(
    (i: number) => {
      if (i < 0 || i > LAST) return
      setPlaying(true)
      goTo(i)
    },
    [goTo],
  )

  // Controles que se escondem durante a exibição e voltam com qualquer interação.
  const poke = useCallback(() => {
    setUiVisible(true)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setUiVisible(false), 3200)
  }, [])

  useEffect(() => {
    if (!started) return
    poke()
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const target = e.target as HTMLElement
      const onButton = target.tagName === 'BUTTON'
      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          if (onButton && e.key === ' ') return
          e.preventDefault()
          toggle()
          break
        case 'ArrowRight':
        case 'l':
        case 'L':
          seek(index + 1)
          break
        case 'ArrowLeft':
        case 'j':
        case 'J':
          seek(index - 1)
          break
        case 'm':
        case 'M':
          toggleMute()
          break
        default:
          return
      }
      poke()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointermove', poke)
    window.addEventListener('pointerdown', poke)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointermove', poke)
      window.removeEventListener('pointerdown', poke)
    }
  }, [started, index, toggle, seek, toggleMute, poke])

  const clock = useMemo(() => ({ t, playing, reduced }), [t, playing, reduced])
  const introClock = useMemo(() => ({ t: 0, playing: true, reduced }), [reduced])
  const Scene = index < SCENES.length ? SCENES[index].Component : null

  return (
    <MotionConfig reducedMotion="user">
      <main className={`app ${reduced ? 'is-reduced' : ''}`} onDoubleClick={started ? toggle : undefined}>
        <AnimatePresence mode="wait">
          {!started && (
            <ClockContext.Provider value={introClock} key="intro">
              <Intro onStart={start} />
            </ClockContext.Provider>
          )}
        </AnimatePresence>

        {started && (
          <>
            <div className="viewport" data-scene-time={t} aria-roledescription="curta interativo" aria-label={`Episódio ${index + 1}: ${CHAPTERS[index].title}`}>
              <AnimatePresence>
                <motion.div
                  key={index}
                  className="scene-frame"
                  initial={{ opacity: 0, scale: 1.06, filter: 'blur(14px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.97, filter: 'blur(10px)' }}
                  transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
                >
                  <ClockContext.Provider value={clock}>{Scene ? <Scene /> : <Credits onReplay={restart} />}</ClockContext.Provider>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="letterbox letterbox--top" aria-hidden="true" />
            <div className="letterbox letterbox--bottom" aria-hidden="true" />

            <AnimatePresence>
              {!playing && (
                <motion.button
                  type="button"
                  className="paused"
                  onClick={toggle}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  aria-label="História pausada. Continuar"
                >
                  <span>❚❚ Pausado</span>
                  <small>toque ou aperte espaço para continuar</small>
                </motion.button>
              )}
            </AnimatePresence>

            <Controls
              chapters={CHAPTERS}
              index={index}
              progress={Math.min(1, t / durationOf(index))}
              playing={playing}
              muted={muted}
              visible={uiVisible || !playing}
              onToggle={toggle}
              onPrev={() => seek(index - 1)}
              onNext={() => seek(index + 1)}
              onSeek={seek}
              onMute={toggleMute}
              onRestart={restart}
            />
          </>
        )}
        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
      </main>
    </MotionConfig>
  )
}
