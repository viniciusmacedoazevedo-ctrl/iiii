import { AnimatePresence, motion } from 'framer-motion'
import { Caption } from '../components/Caption'
import { Walker } from '../components/Characters'
import { Particles } from '../components/Particles'
import { Landscape, SkyFlight, Street } from '../components/Scenery'
import { ChapterTag, LocationTag, Shot } from '../components/Shot'
import { useClock } from '../engine/clock'

export function S1Canada() {
  const { t } = useClock()
  const shot = t < 7000 ? 'flight' : t < 13500 ? 'rockies' : 'street'

  return (
    <div className="scene scene--cold">
      <AnimatePresence>
        {shot === 'flight' && (
          <Shot key="flight" push={0.12} duration={8}>
            <SkyFlight />
          </Shot>
        )}
        {shot === 'rockies' && (
          <Shot key="rockies" push={0.1} duration={7}>
            <Landscape palette="winter" pan={160} duration={8} />
            <Particles kind="snow" count={160} wind={0.4} />
            <motion.div
              className="walker-track"
              initial={{ left: '8%' }}
              animate={{ left: '46%' }}
              transition={{ duration: 7, ease: 'linear' }}
            >
              <Walker className="walker walker--far" title="Ele caminhando entre montanhas nevadas" />
            </motion.div>
          </Shot>
        )}
        {shot === 'street' && (
          <Shot key="street" push={0.08} duration={7}>
            <Street pan={300} duration={8} />
            <Particles kind="snow" count={120} wind={0.2} />
            <motion.div
              className="walker-track"
              initial={{ left: '20%' }}
              animate={{ left: '52%' }}
              transition={{ duration: 7, ease: 'linear' }}
            >
              <Walker className="walker walker--mid" pose={t > 16500 ? 'phone' : 'free'} title="Ele explorando uma rua coberta de neve" />
            </motion.div>
          </Shot>
        )}
      </AnimatePresence>

      <div className="grade grade--cold" />
      <ChapterTag show={t > 600 && t < 6500} number={1} title="O Intercâmbio" />
      <LocationTag show={shot === 'flight' && t > 2200} place="Voo 0716 · Destino: Canadá" detail="Altitude 11.000 m" />
      <LocationTag show={shot === 'rockies'} place="Banff · Alberta" detail="−12 °C · sensação de recomeço" />
      <LocationTag show={shot === 'street'} place="Quebec · Cidade Velha" detail="Semana 3 do intercâmbio" />
      <Caption
        show={t > 8200}
        text="Ele foi para o Canadá buscando novas experiências. Não imaginava que a maior surpresa estaria esperando por ele no celular."
      />
    </div>
  )
}
