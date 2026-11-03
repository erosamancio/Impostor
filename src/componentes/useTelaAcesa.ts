import { useEffect } from 'react'

/** Mantém a tela acesa durante a partida, onde o navegador permitir. */
export const useTelaAcesa = (ativo: boolean) => {
  useEffect(() => {
    if (!ativo || !('wakeLock' in navigator)) return
    let trava: WakeLockSentinel | null = null
    let cancelado = false

    const pedir = () => {
      if (document.visibilityState !== 'visible') return
      navigator.wakeLock
        .request('screen')
        .then((nova) => {
          if (cancelado) void nova.release()
          else trava = nova
        })
        .catch(() => {})
    }

    pedir()
    document.addEventListener('visibilitychange', pedir)
    return () => {
      cancelado = true
      document.removeEventListener('visibilitychange', pedir)
      void trava?.release()
    }
  }, [ativo])
}
