import { AnimatePresence, motion } from 'framer-motion'
import { score } from '../audio/score'
import { Aside } from '../components/Caption'
import { Girl } from '../components/Characters'
import { Particles } from '../components/Particles'
import { Phone, type Message } from '../components/Phone'
import { ChapterTag } from '../components/Shot'
import { progress, typed, useClock, useCue } from '../engine/clock'

export const DECLARATION =
  'Eu sei que errei com você. Sei que te magoei e que talvez seja tarde demais, mas percebi que ainda gosto de você. Queria poder voltar atrás.'

const TYPE_AT = 2600
const MS_PER_CHAR = 62
const SEND_AT = TYPE_AT + DECLARATION.length * MS_PER_CHAR + 900
const SILENCE_AT = SEND_AT + 300
const SEEN_AT = SEND_AT + 3600

const HISTORY: Message[] = [
  { id: 'h1', from: 'them', text: 'boa noite! vai dormir cedo hoje', time: '23:10' },
  { id: 'h2', from: 'me', text: 'vou… mas antes queria te falar uma coisa', time: '23:39', read: true },
]

export function S6Declaration() {
  const { t } = useClock()
  const sent = t >= SEND_AT
  const messages: Message[] = sent
    ? [...HISTORY, { id: 'decl', from: 'me', text: DECLARATION, time: '23:47', read: t >= SEEN_AT }]
    : HISTORY
  const glow = progress(t, TYPE_AT, SEND_AT)

  useCue(SILENCE_AT, () => score.setMood('silence'))

  return (
    <div className="scene scene--declaration">
      <motion.div className="spot" animate={{ opacity: 0.25 + glow * 0.55, scale: 0.9 + glow * 0.2 }} transition={{ duration: 0.6 }} aria-hidden="true" />
      <Particles kind="dust" count={40} wind={0.04} />

      <motion.div
        className="stage stage--declaration"
        animate={{ scale: sent ? 1.06 : 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <motion.div
          className="declaration__her"
          animate={{ opacity: sent ? 0.35 : 1, x: sent ? -20 : 0 }}
          transition={{ duration: 2 }}
        >
          <Girl mood={t < TYPE_AT ? 'nervous' : sent ? 'hopeful' : 'teary'} look="down" outfit="sweater" rim="#d6a8ff" title="Ela, emocionada, escrevendo uma declaração" />
        </motion.div>
        <Phone
          label="Celular dela: a declaração"
          contact="Theo 🇨🇦"
          status={t >= SEEN_AT ? 'online' : sent ? 'entregue' : 'online'}
          avatar="🧑🏻"
          messages={messages}
          draft={sent ? '' : typed(DECLARATION, t, TYPE_AT, MS_PER_CHAR)}
          theme="dusk"
          clock="23:47"
        />
      </motion.div>

      <ChapterTag show={t > 300 && t < 2400} number={6} title="A Declaração" />
      <Aside show={t > 900 && t < SEND_AT - 1500} className="aside--top-right">
        Ela digitou e apagou isso 14 vezes.
        <br />
        Esta é a 15ª.
      </Aside>
      <AnimatePresence>
        {t >= SEEN_AT + 600 && (
          <motion.p className="silence-note" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }} transition={{ duration: 2 }}>
            Visualizada às 23:47.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
