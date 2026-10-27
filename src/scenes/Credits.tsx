import { motion } from 'framer-motion'
import { useClock } from '../engine/clock'

const CREDITS: [string, string][] = [
  ['Baseado em', 'nenhuma história real (juramos)'],
  ['Theo', 'interpretado por ele mesmo, em sua melhor fase'],
  ['Lara', 'interpretada por uma personagem 100% fictícia'],
  ['O garoto da jaqueta vermelha', 'não compareceu às gravações'],
  ['Direção', 'O Destino'],
  ['Roteiro', 'O Destino & A Varicela'],
  ['Consultoria médica', 'Loção de Calamina'],
  ['Direção de fotografia', 'O pôr do sol canadense'],
  ['Trilha sonora original', 'sintetizada ao vivo no seu navegador'],
  ['Efeitos especiais', 'Dun Dun Dunnn Ltda.'],
  ['Agradecimentos', 'à terapia, ao Canadá e à função “arquivar conversa”'],
]

export function Credits({ onReplay }: { onReplay: () => void }) {
  const { t } = useClock()
  return (
    <div className="scene scene--credits">
      <motion.div
        className="credits"
        initial={{ y: '62vh', opacity: 1 }}
        animate={{ y: '-30%', opacity: t > 14000 ? 0.12 : 1 }}
        transition={{ y: { duration: 22, ease: 'linear' }, opacity: { duration: 1.2 } }}
      >
        <h2 className="credits__title">Tarde Demais</h2>
        <p className="credits__subtitle">Amor em Quarentena</p>
        <dl>
          {CREDITS.map(([role, who]) => (
            <div key={role} className="credits__row">
              <dt>{role}</dt>
              <dd>{who}</dd>
            </div>
          ))}
        </dl>
        <p className="credits__disclaimer">
          Esta é uma obra de ficção. Qualquer semelhança com pessoas, intercâmbios ou catapora reais é mera coincidência.
          <br />
          Nenhum coração foi partido sem necessidade durante as filmagens.
        </p>
      </motion.div>
      {t > 14000 && (
      <motion.div
        className="credits__end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <span className="credits__fim">Fim.</span>
        <button type="button" className="btn btn--primary" onClick={onReplay}>
          ↺ Assistir de novo
        </button>
      </motion.div>
      )}
    </div>
  )
}
