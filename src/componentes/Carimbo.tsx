type CarimboProps = { linhas: readonly [string, string]; cor: 'aereo' | 'postal' }

const CORES = { aereo: 'text-aereo', postal: 'text-postal' } as const

/** Carimbo postal circular que "bate" no resultado. É o único momento de animação forte do jogo. */
export const Carimbo = ({ linhas, cor }: CarimboProps) => (
  <div
    className={`animar-carimbo flex size-44 flex-col items-center justify-center rounded-full border-[5px] border-current text-center ${CORES[cor]}`}
    style={{ boxShadow: 'inset 0 0 0 5px var(--color-tinta), inset 0 0 0 7px currentColor' }}
  >
    <span className="text-[15px] font-extrabold tracking-[0.18em]">{linhas[0]}</span>
    <span className="my-1 h-0.5 w-24 bg-current" />
    <span className="text-[26px] leading-none font-extrabold tracking-[-0.01em]">{linhas[1]}</span>
  </div>
)
