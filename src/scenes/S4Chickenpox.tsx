import { AnimatePresence, motion } from 'framer-motion'
import { score } from '../audio/score'
import { Aside, Caption } from '../components/Caption'
import { Boy, Girl, type GirlMood } from '../components/Characters'
import { Phone } from '../components/Phone'
import { ChapterTag } from '../components/Shot'
import { typed, useClock, useCue } from '../engine/clock'

const FIRST_DRAFT = 'oi, tudo bem? lembra de mim kkkk'
const ZOOM_AT = 10800
const PHONE_AT = 13600
const DELETE_AT = 15600
const RETYPE_AT = 16700
const SEND_AT = 17500

function draftAt(t: number) {
  if (t < DELETE_AT) return typed(FIRST_DRAFT, t, PHONE_AT + 300, 55)
  if (t < RETYPE_AT) {
    const left = FIRST_DRAFT.length - Math.floor((t - DELETE_AT) / 28)
    return FIRST_DRAFT.slice(0, Math.max(0, left))
  }
  if (t < SEND_AT) return typed('oi', t, RETYPE_AT, 220)
  return ''
}

export function S4Chickenpox() {
  const { t, reduced } = useClock()
  const zooming = t >= ZOOM_AT && t < PHONE_AT
  const onPhone = t >= PHONE_AT
  const mood: GirlMood = t < 7400 ? 'sick' : t < 10200 ? 'thinking' : t < PHONE_AT ? 'idea' : 'nervous'

  useCue(ZOOM_AT + 200, () => score.dun())

  return (
    <div className="scene scene--pox">
      <AnimatePresence>
        {!onPhone && (
          <motion.div
            key="bedroom"
            className="bedroom"
            exit={{ opacity: 0, scale: 3.2, filter: 'blur(6px)' }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="bedroom__camera"
              animate={zooming ? { scale: reduced ? 1 : 2.4, x: '-34%', y: '-62%' } : { scale: 1, x: 0, y: 0 }}
              transition={zooming ? { type: 'spring', stiffness: 60, damping: 9 } : { duration: 1 }}
            >
              <div className="bedroom__wall" aria-hidden="true">
                <div className="bedroom__window">
                  <div className="bedroom__sun" />
                </div>
                <div className="bedroom__poster">🍁</div>
              </div>
              <div className="bed" aria-hidden="true">
                <div className="bed__headboard" />
                <div className="bed__pillow" />
              </div>
              <div className="bedroom__girl">
                <Girl mood={mood} look={t > 7400 && t < 10200 ? 'up' : t >= 10200 ? 'right' : 'center'} spots outfit="pajama" title="Ela de repouso, com catapora, entediada na cama" />
                <motion.div
                  className="thermometer"
                  initial={{ rotate: -14 }}
                  animate={{ rotate: [-14, -6, -14] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  aria-hidden="true"
                >
                  <span />
                </motion.div>
              </div>
              <div className="blanket" aria-hidden="true" />
              <div className="nightstand" aria-hidden="true">
                <span className="lotion">LOÇÃO DE CALAMINA</span>
                <span className="tissues" />
              </div>
              <motion.div
                aria-hidden="true"
                className="bed-phone"
                animate={t > 10200 ? { rotate: [0, -8, 8, -6, 6, 0] } : { rotate: 0 }}
                transition={{ duration: 0.5, repeat: t > 10200 && t < ZOOM_AT ? Infinity : 0 }}
              >
                <span />
              </motion.div>

              <AnimatePresence>
                {t > 7600 && t < ZOOM_AT && (
                  <motion.div
                    className="thought"
                    initial={{ opacity: 0, scale: 0.4, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                    aria-label="Ela pensando nele"
                  >
                    <i className="thought__dot thought__dot--1" />
                    <i className="thought__dot thought__dot--2" />
                    <div className="thought__cloud">
                      <Boy mood="happy" outfit="parka" className="thought__boy" title="Lembrança dele sorrindo" />
                      <span className="thought__text">…e se eu mandar só um “oi”?</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="stamp" aria-hidden={t < 1600}>
              <motion.span initial={{ scale: 3, opacity: 0, rotate: -18 }} animate={t > 1600 ? { scale: 1, opacity: 1, rotate: -8 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                DIA 3 DE REPOUSO
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zooming && (
          <motion.div
            className="dun"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Música de suspense: dun dun dunnn"
          >
            <div className="speedlines" aria-hidden="true" />
            {['DUN', 'DUN', 'DUNNN!'].map((w, i) => (
              <motion.span
                key={i}
                initial={{ scale: 4, opacity: 0, rotate: (i - 1) * 8 }}
                animate={{ scale: 1, opacity: 1, rotate: (i - 1) * 6 }}
                transition={{ delay: 0.25 + i * 0.44, type: 'spring', stiffness: 380, damping: 12 }}
              >
                {w}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {onPhone && (
          <motion.div
            key="phone"
            className="stage stage--center"
            initial={{ opacity: 0, scale: 1.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Phone
              label="Celular dela: conversa com ele, arquivada há dois meses"
              contact="Theo 🇨🇦"
              status="visto por último há 2 meses"
              avatar="🧑🏻"
              messages={
                t >= SEND_AT
                  ? [
                      { id: 'old', from: 'system', text: 'Mensagens de 2 meses atrás' },
                      { id: 'oi', from: 'me', text: 'oi', time: '15:12' },
                    ]
                  : [{ id: 'old', from: 'system', text: 'Mensagens de 2 meses atrás' }]
              }
              draft={draftAt(t)}
              theme="dusk"
              clock="15:12"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ChapterTag show={t > 300 && t < 3600} number={4} title="A Grande Reviravolta" />
      <Aside show={t > 3200 && t < 7400} className="aside--top-right">
        Diagnóstico: catapora.
        <br />
        Efeito colateral: carência.
      </Aside>
      <Aside show={t > 5200 && t < 7400} className="aside--top-right aside--second">
        Já maratonou tudo. Até os termos de uso.
      </Aside>
      <Aside show={t > 16000 && t < 19400} className="aside--top-right">
        Versão 1: quatro parágrafos.
        <br />
        Versão final: “oi”.
      </Aside>
      <motion.div className="blackout" animate={{ opacity: t > 18000 ? 0.72 : 0 }} transition={{ duration: 1.2 }} aria-hidden="true" />
      <Caption show={t > 18200} text="Às vezes, a vida coloca você de repouso… e seus sentimentos de volta à conversa." />
    </div>
  )
}
