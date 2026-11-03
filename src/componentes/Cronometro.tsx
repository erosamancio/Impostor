import { RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

type CronometroProps = { segundos: number }

/** Contagem regressiva da dica. Quem usa deve trocar a `key` a cada vez para reiniciar. */
export const Cronometro = ({ segundos }: CronometroProps) => {
  const [restante, setRestante] = useState(segundos)

  useEffect(() => {
    if (restante <= 0) {
      navigator.vibrate?.(250)
      return
    }
    const id = window.setTimeout(() => setRestante((r) => r - 1), 1000)
    return () => window.clearTimeout(id)
  }, [restante])

  const acabou = restante <= 0
  const fracao = Math.max(0, restante / segundos)

  return (
    <div className="w-full rounded-2xl bg-envelope p-4 ring-1 ring-vinco">
      <div className="flex items-center justify-between">
        <span className={`text-[15px] font-semibold ${acabou ? 'text-aereo' : 'text-papel-suave'}`}>
          {acabou ? 'Tempo esgotado' : 'Tempo para a dica'}
        </span>
        <span className="flex items-center gap-2">
          <span className={`text-2xl font-extrabold tabular-nums ${acabou ? 'text-aereo' : 'text-papel'}`}>
            {formatar(Math.max(0, restante))}
          </span>
          <button
            type="button"
            aria-label="Reiniciar o tempo"
            onClick={() => setRestante(segundos)}
            className="flex size-9 items-center justify-center rounded-full text-papel-suave active:bg-envelope-alto"
          >
            <RotateCcw size={18} strokeWidth={2.25} />
          </button>
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-tinta">
        <div
          className={`h-full origin-left rounded-full transition-transform duration-1000 ease-linear ${acabou ? 'bg-aereo' : 'bg-selo'}`}
          style={{ transform: `scaleX(${fracao})` }}
        />
      </div>
    </div>
  )
}

const formatar = (segundos: number) => `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`
