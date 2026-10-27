import { motion } from 'framer-motion'
import { Aside } from '../components/Caption'
import { Boy, type BoyMood } from '../components/Characters'
import { Particles } from '../components/Particles'
import { Phone, type Message } from '../components/Phone'
import { Landscape } from '../components/Scenery'
import { ChapterTag } from '../components/Shot'
import { typed, useClock } from '../engine/clock'
import { DECLARATION } from './S6Declaration'

export const REPLY =
  'Eu não guardo rancor de você. Gosto de conversar contigo e quero que você fique bem, mas meus sentimentos mudaram. Prefiro que a gente continue sendo amigo.'

const TYPE_AT = 8200
const MS_PER_CHAR = 48
const SEND_AT = TYPE_AT + REPLY.length * MS_PER_CHAR + 700

export function S7Reply() {
  const { t } = useClock()
  const sent = t >= SEND_AT
  const messages: Message[] = [
    { id: 'decl', from: 'them', text: DECLARATION, time: '23:47' },
    ...(sent ? [{ id: 'reply', from: 'me' as const, text: REPLY, time: '23:58', read: t > SEND_AT + 2200 }] : []),
  ]
  const mood: BoyMood = t < 4500 ? 'calm' : t < TYPE_AT ? 'thinking' : sent ? 'confident' : 'calm'

  return (
    <div className="scene scene--reply">
      <motion.div
        className="layer"
        initial={{ scale: 1.18, x: '3%' }}
        animate={{ scale: 1.05, x: '-1.5%' }}
        transition={{ duration: 24, ease: [0.3, 0.1, 0.3, 1] }}
      >
        <Landscape palette="sunset" pan={90} duration={24} sunY={430} />
        <svg className="scenery skyline" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <path
            d="M0 720 L0 640 L60 640 L60 600 L110 600 L110 650 L170 650 L170 560 L230 560 L230 630 L300 630 L300 590 L330 590 L330 520 L345 520 L345 380 L352 340 L359 380 L359 520 L374 520 L374 600 L430 600 L430 540 L500 540 L500 620 L560 620 L560 580 L640 580 L640 640 L1600 640 L1600 720 Z"
            fill="#2a1a2c"
            opacity="0.9"
          />
          {Array.from({ length: 26 }, (_, i) => (
            <rect key={i} x={70 + (i * 23) % 560} y={570 + ((i * 37) % 60)} width="5" height="7" fill="#ffd08a" opacity="0.8" />
          ))}
        </svg>
      </motion.div>
      <Particles kind="embers" count={60} wind={0.12} />
      <div className="flare" aria-hidden="true" />
      <div className="grade grade--gold" />

      <div className="stage stage--split stage--reply">
        <motion.div
          className="stage__actor stage__actor--hero"
          initial={{ opacity: 0, y: 40, scale: 1.08 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 2.4, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <Boy mood={mood} look={t > 2400 && t < 4500 ? 'right' : 'down'} outfit="coat" rim="#ffc56b" title="Ele, elegante ao pôr do sol, lendo a mensagem com calma" />
        </motion.div>
        <motion.div
          className="stage__device"
          initial={{ opacity: 0, x: 60, rotate: 4 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 1.6, duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <Phone
            label="Celular dele: a resposta"
            contact="Lara"
            status="online"
            avatar="👩🏻‍🦰"
            messages={messages}
            draft={sent ? '' : typed(REPLY, t, TYPE_AT, MS_PER_CHAR)}
            theme="warm"
            clock="23:58"
          />
        </motion.div>
      </div>

      <ChapterTag show={t > 400 && t < 4200} number={7} title="A Resposta Dele" />
      <Aside show={t > 4600 && t < 8800} className="aside--top-right">
        Ele leu. Pensou. Não entrou em pânico.
        <br />
        Isso se chama maturidade. Ou Canadá.
      </Aside>
      <Aside show={sent && t > SEND_AT + 1600} className="aside--top-right">
        Perdão: concedido.
        <br />
        Sentimentos: não reembolsáveis.
      </Aside>
    </div>
  )
}
