# Tarde Demais: Amor em Quarentena

> Ela percebeu que amava ele. O problema é que ele já tinha superado.

Curta-metragem interativo (~4 min, 8 episódios + créditos) sobre traição, arrependimento,
catapora e superação — com humor ácido e estética de série dramática. Personagens e
conversas são 100% fictícios.

## Rodando

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # typecheck + build de produção em dist/
npm run preview   # serve o build
```

## Controles

| Ação | Teclado | Tela |
| --- | --- | --- |
| Pausar / continuar | `Espaço` ou `K` | botão central, ou duplo clique |
| Cena anterior / próxima | `←` / `→` (ou `J` / `L`) | botões ⏮ ⏭ |
| Ir para um episódio | — | barra de capítulos |
| Ligar / desligar som | `M` | botão de volume |
| Recomeçar | — | botão ↺ |

A história avança sozinha; os controles somem durante a exibição e voltam com qualquer
interação. A narrativa pausa automaticamente quando a aba perde o foco.

## Estrutura

```
src/
  App.tsx              player: relógio narrativo, transições entre cenas, teclado
  engine/clock.tsx     relógio da cena (pausável), digitação e "cues" sincronizados
  audio/score.ts       trilha original sintetizada com Web Audio (um "humor" por cena)
  components/
    Characters.tsx     Ele, Ela e a silhueta caminhando (SVG com expressões animadas)
    Scenery.tsx        céu com avião, Montanhas Rochosas, rua de Quebec (parallax)
    Particles.tsx      neve, poeira, pétalas, folhas e brasas em canvas
    Phone.tsx          interface de mensagens com balões animados
    Caption, Shot, Controls, Intro
  scenes/              S1Canada … S8Final, Credits
```

Decisões técnicas:

- **React + TypeScript + Vite + Framer Motion.** Sem Three.js: as cenas são ilustrações
  vetoriais em camadas, o que mantém o pacote leve e a direção de arte consistente.
- **Relógio por cena.** Cada cena lê o tempo decorrido (`useClock`) e decide o que mostrar;
  por isso pausar, pular e voltar são determinísticos e nada "se perde" num `setTimeout`.
- **Trilha sonora gerada em tempo real** — acordes, arpejos, batidas de coração e o
  "DUN DUN DUNNN" são sintetizados no navegador; não há arquivos de áudio nem direitos autorais.
- **Acessibilidade.** Respeita `prefers-reduced-motion` (sem tremor, zoom, granulação
  animada ou partículas em movimento), legendas e mensagens em regiões `aria-live`,
  todos os controles acessíveis por teclado e com rótulos.
- **Responsivo.** Layouts próprios para celular (retrato) e computador.
