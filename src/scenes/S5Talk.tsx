import { motion } from 'framer-motion'
import { Aside } from '../components/Caption'
import { Boy, Girl } from '../components/Characters'
import { Particles } from '../components/Particles'
import { Phone, type Message } from '../components/Phone'
import { ChapterTag } from '../components/Shot'
import { progress, useClock } from '../engine/clock'

type Timed = Message & { at: number }

// Celular dela: "me" = ela, "them" = ele.
const THREAD: Timed[] = [
  { at: 0, id: 't0', from: 'me', text: 'oi', time: '15:12', read: true },
  { at: 2600, id: 't1', from: 'them', text: 'oi. quanto tempo', time: '15:40' },
  { at: 4000, id: 't2', from: 'me', text: 'pois é… tô de molho com catapora 🫠', time: '15:41', read: true },
  { at: 5500, id: 't3', from: 'them', text: 'catapora?? com 16 anos? kkkkk', time: '15:44' },
  { at: 6400, id: 't4', from: 'them', text: 'melhoras. passa calamina e não coça', time: '15:44' },
  { at: 7800, id: 't5', from: 'system', text: 'QUINTA-FEIRA' },
  { at: 8500, id: 't6', from: 'me', text: 'como tá o Canadá?', time: '19:02', read: true },
  { at: 9900, id: 't7', from: 'them', text: 'frio. lindo. aprendi a patinar sem cair (mentira)', time: '19:10' },
  { at: 11100, id: 't8', from: 'me', text: 'kkkkkkk', time: '19:10', read: true },
  { at: 12300, id: 't9', from: 'system', text: 'SÁBADO' },
  { at: 13000, id: 't10', from: 'them', text: 'olha o pôr do sol daqui', photo: 'Pôr do sol no lago 🌅', time: '18:21' },
  { at: 14700, id: 't11', from: 'me', text: 'que lindo… tô feliz por você, de verdade', time: '18:24', read: true },
  { at: 16200, id: 't12', from: 'them', text: 'valeu! e você, melhorou?', time: '18:30' },
  { at: 17500, id: 't13', from: 'me', text: 'as bolinhas tão sumindo. a vergonha não', time: '18:31', read: true },
  { at: 18800, id: 't14', from: 'them', text: 'kkkkkkk faz parte', time: '18:33' },
]

const TYPING: [number, number][] = [
  [1300, 2600],
  [4700, 5500],
  [9000, 9900],
  [15500, 16200],
  [18200, 18800],
]

export function S5Talk() {
  const { t } = useClock()
  const thread = THREAD.filter((m) => t >= m.at)
  const typing = TYPING.some(([a, b]) => t >= a && t < b)
  const warmth = progress(t, 1000, 17000)

  return (
    <div className="scene scene--talk">
      <motion.div className="warm-bg" animate={{ opacity: warmth }} transition={{ duration: 0.6 }} aria-hidden="true" />
      <Particles kind="dust" count={70} wind={0.1} />

      <div className="stage stage--talk">
        <motion.div className="talk-side talk-side--her" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 1 }}>
          <Girl mood={t < 3000 ? 'nervous' : t < 11000 ? 'smile' : 'hopeful'} look="down" spots={t < 15000} outfit="pajama" title="Ela conversando, mais leve a cada mensagem" />
          <div className="status-card">
            <strong>Ela</strong>
            <span>{t < 9000 ? 'digitando… apagando… digitando…' : 'sorrindo pro celular, sozinha no quarto'}</span>
          </div>
        </motion.div>

        <div className="stage__device">
          <Phone label="Celular dela: os dois voltando a conversar" contact="Theo 🇨🇦" status="online" avatar="🧑🏻" messages={thread} typing={typing} theme={t < 9500 ? 'cold' : 'warm'} clock={t < 7800 ? '15:44' : t < 12300 ? '19:10' : '18:33'} />
        </div>

        <motion.div className="talk-side talk-side--him" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 1 }}>
          <Boy mood={t < 5000 ? 'neutral' : 'calm'} look="down" outfit="parka" rim="#ffcf9a" title="Ele respondendo, tranquilo e amigável" />
          <div className="status-card">
            <strong>Ele</strong>
            <span>{t < 9000 ? 'respondendo entre um passeio e outro' : 'tranquilo. tipo, tranquilo mesmo.'}</span>
          </div>
        </motion.div>
      </div>

      <div className="climate" aria-label={`Clima entre os dois: ${warmth < 0.5 ? 'guerra fria' : 'paz'}`}>
        <span>Clima</span>
        <div className="climate__bar">
          <motion.i animate={{ width: `${8 + warmth * 92}%` }} transition={{ duration: 0.4 }} />
        </div>
        <span>{warmth < 0.35 ? '🧊 guerra fria' : warmth < 0.75 ? '🌤️ cessar-fogo' : '☀️ paz'}</span>
      </div>

      <ChapterTag show={t > 300 && t < 4200} number={5} title="Eles Voltam a se Falar" />
      <Aside show={t > 19600} className="aside--top-right">
        Amizade restaurada. Só amizade.
        <br />
        Guarde essa informação.
      </Aside>
    </div>
  )
}
