import { AnimatePresence, motion } from 'framer-motion'
import { Caption } from '../components/Caption'
import { Girl, Walker } from '../components/Characters'
import { Particles } from '../components/Particles'
import { Phone, type Message } from '../components/Phone'
import { Landscape } from '../components/Scenery'
import { ChapterTag } from '../components/Shot'
import { useClock } from '../engine/clock'

type Timed = Message & { at: number }

const THREAD: Timed[] = [
  { at: 0, id: 'f0', from: 'them', text: '…prefiro que a gente continue sendo amigo.', time: '23:58' },
  { at: 1400, id: 'f1', from: 'me', text: 'tudo bem. obrigada por ser sincero 🤍', time: '00:03', read: true },
  { at: 3200, id: 'f2', from: 'them', text: 'sempre. amigos?', time: '00:04' },
  { at: 4600, id: 'f3', from: 'me', text: 'amigos.', time: '00:04', read: true },
  { at: 6200, id: 'f4', from: 'them', text: 'agora vai dormir e para de coçar 😂', time: '00:05' },
]

const POCKET_AT = 7600
const PULLBACK_AT = 9000
const FINAL_AT = 14500

export function S8Final() {
  const { t } = useClock()
  const thread = THREAD.filter((m) => t >= m.at)
  const final = t >= FINAL_AT

  return (
    <div className="scene scene--final">
      <motion.div
        className="final-frame"
        animate={t >= PULLBACK_AT ? { scale: 0.8, borderRadius: 28 } : { scale: 1, borderRadius: 0 }}
        transition={{ duration: 6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="split">
          <section className="split__half split__half--her" aria-label="Ela, em casa">
            <div className="her-room" aria-hidden="true" />
            <div className="split__girl">
              <Girl mood={t > 6400 ? 'smile' : t > 1400 ? 'neutral' : 'sad'} look="down" outfit="sweater" title="Ela sorri discretamente com a mensagem amigável" />
            </div>
            <div className="split__phone">
              <Phone label="Celular dela: conversa amigável" contact="Theo 🇨🇦" status="online" avatar="🧑🏻" messages={thread} theme="warm" clock="00:05" />
            </div>
          </section>
          <section className="split__half split__half--him" aria-label="Ele, caminhando ao pôr do sol">
            <Landscape palette="sunset" pan={260} duration={26} sunY={520} />
            <Particles kind="leaves" count={40} wind={0.6} />
            <motion.div className="walker-track walker-track--final" initial={{ left: '18%' }} animate={{ left: '64%' }} transition={{ duration: 22, ease: 'linear' }}>
              <Walker className="walker walker--final" outfit="coat" pose={t < POCKET_AT ? 'phone' : 'pocket'} title="Ele guarda o celular no bolso e segue em frente" />
            </motion.div>
            <AnimatePresence>
              {t > POCKET_AT && t < POCKET_AT + 2600 && (
                <motion.span className="pocket-note" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  celular no bolso. vida em primeiro plano.
                </motion.span>
              )}
            </AnimatePresence>
          </section>
        </div>
        <div className="grade grade--gold" />
      </motion.div>

      <ChapterTag show={t > 300 && t < 3200} number={8} title="O Final" />
      <motion.div className="blackout" animate={{ opacity: final ? 0.9 : 0 }} transition={{ duration: 2.4 }} aria-hidden="true" />
      <div className="finale-text">
        <Caption show={final} text="Ela voltou para a vida dele. Mas ele não voltou a ser dela." position="center" size="xl" className="caption--serif" />
        <AnimatePresence>
          {t > FINAL_AT + 5200 && (
            <motion.p className="finale-text__lesson" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.6 }}>
              Algumas histórias não terminam com um casal. Terminam com uma lição.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
