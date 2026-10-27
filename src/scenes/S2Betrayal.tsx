import { AnimatePresence, motion } from 'framer-motion'
import { score } from '../audio/score'
import { Aside, Caption } from '../components/Caption'
import { Boy, type BoyMood } from '../components/Characters'
import { Particles } from '../components/Particles'
import { Phone, type Message } from '../components/Phone'
import { ChapterTag } from '../components/Shot'
import { progress, useClock, useCue } from '../engine/clock'

type Timed = Message & { at: number }

const UNKNOWN: Timed[] = [
  { at: 1200, id: 'u1', from: 'them', text: 'Oi. Você não me conhece, mas acho que você precisa saber de uma coisa.', time: '23:38' },
  { at: 3600, id: 'u2', from: 'them', text: 'Essa é a sua namorada, né? Ela não tava sozinha na festa.', photo: 'Festa de sábado · 01:47', time: '23:39' },
  { at: 7200, id: 'u3', from: 'me', text: 'Isso é montagem.', time: '23:40', read: true },
  { at: 8900, id: 'u4', from: 'them', text: 'Pergunta pra ela sobre o garoto da jaqueta vermelha.', time: '23:40' },
]

const ARGUMENT: Timed[] = [
  { at: 11600, id: 'a1', from: 'me', text: 'Quem é o cara da jaqueta vermelha?', time: '23:42', read: true },
  { at: 13400, id: 'a2', from: 'them', text: 'não é o que você tá pensando', time: '23:42' },
  { at: 14300, id: 'a3', from: 'me', text: 'Então me fala o que é.', time: '23:42', read: true },
  { at: 15300, id: 'a4', from: 'them', text: 'foi só uma vez. você tava longe, eu me senti sozinha', time: '23:43' },
  { at: 16700, id: 'a5', from: 'me', text: 'Eu tava longe. Não tava solteiro.', time: '23:43', read: true },
  { at: 17600, id: 'a6', from: 'them', text: 'me desculpa', time: '23:43' },
  { at: 18100, id: 'a7', from: 'them', text: 'por favor', time: '23:43' },
  { at: 18550, id: 'a8', from: 'them', text: 'fala comigo', time: '23:44' },
]

export function S2Betrayal() {
  const { t, reduced } = useClock()
  const onArgument = t >= 10800
  const thread = (onArgument ? ARGUMENT : UNKNOWN).filter((m) => t >= m.at)
  const typing = onArgument ? (t > 12600 && t < 13400) || (t > 14700 && t < 15300) : t > 2500 && t < 3600

  const mood: BoyMood = t < 4600 ? 'neutral' : t < 8000 ? 'shocked' : t < 15000 ? 'angry' : 'sad'
  const dark = progress(t, 0, 19000)
  const shaking = !reduced && t > 13300 && t < 19200

  useCue(16700, () => score.impact())

  return (
    <div className="scene scene--betrayal">
      <div className="room room--night" aria-hidden="true">
        <div className="room__window">
          <Particles kind="snow" count={60} wind={0.15} />
        </div>
        <motion.div className="room__lamp" animate={{ opacity: 1 - dark * 0.85 }} />
      </div>
      <motion.div className="phone-light" animate={{ opacity: 0.4 + dark * 0.6 }} aria-hidden="true" />

      <div className={`stage stage--split ${shaking ? 'is-shaking' : ''}`}>
        <motion.div
          className="stage__actor"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0, scale: t > 4600 && t < 8000 ? 1.05 : 1 }}
          transition={{ duration: 1.2 }}
        >
          <Boy mood={mood} look={t < 4600 || t > 10800 ? 'down' : 'center'} outfit="hoodie" rim={t > 10800 ? '#ff6b7a' : '#8fb8ff'} title="Ele lendo as mensagens, cada vez mais decepcionado" />
        </motion.div>
        <div className="stage__device">
          <AnimatePresence mode="wait">
            {!onArgument ? (
              <motion.div key="unknown" exit={{ opacity: 0, x: 40, filter: 'blur(8px)' }} transition={{ duration: 0.5 }}>
                <Phone label="Celular dele: conversa com número desconhecido" contact="+55 •• •••••-••42" status="online" avatar="❔" messages={thread} typing={typing} theme="cold" clock="23:40" />
              </motion.div>
            ) : (
              <motion.div key="argument" initial={{ opacity: 0, x: -40, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} transition={{ duration: 0.5 }}>
                <Phone label="Celular dele: discussão com ela" contact="Lara 🤍" status={t > 16700 ? 'visto por último agora' : 'online'} avatar="👩🏻‍🦰" messages={thread} typing={typing} theme="night" clock="23:43" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div className="vignette vignette--red" animate={{ opacity: dark * 0.9 }} aria-hidden="true" />
      <ChapterTag show={t > 400 && t < 4000} number={2} title="A Traição" />
      <Aside show={t > 5200 && t < 10600} className="aside--top-right">
        Sinal: 5G.
        <br />
        Lealdade: 0G.
      </Aside>
      <Aside show={t > 16900 && t < 19800} className="aside--top-right">
        Plot twist: o fuso horário não era o problema.
      </Aside>
      <motion.div className="blackout" animate={{ opacity: t > 19500 ? 0.85 : 0 }} transition={{ duration: 1.4 }} aria-hidden="true" />
      <Caption show={t > 19800} text="Distância não destruiu o relacionamento. As escolhas dela, sim." position="center" size="lg" />
    </div>
  )
}
