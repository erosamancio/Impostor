/**
 * Envelope desenhado à mão em SVG: frente com selo, carimbo postal e o destinatário.
 * Aparece na tela inicial; o segredo de cada partida mora "dentro" dele.
 */
export const Envelope = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 340 220" role="img" aria-label="Envelope fechado endereçado a todos, menos um" className={className}>
    <defs>
      <mask id="selo-picotado">
        <rect x="236" y="22" width="78" height="92" fill="#fff" />
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} fill="#000">
            <circle cx={240 + i * 10} cy={22} r={3.2} />
            <circle cx={240 + i * 10} cy={114} r={3.2} />
          </g>
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <g key={`v${i}`} fill="#000">
            <circle cx={236} cy={27 + i * 10.5} r={3.2} />
            <circle cx={314} cy={27 + i * 10.5} r={3.2} />
          </g>
        ))}
      </mask>
      <clipPath id="corpo-envelope">
        <rect x="8" y="8" width="316" height="196" rx="12" />
      </clipPath>
      <linearGradient id="papel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e7ecf7" />
        <stop offset="1" stopColor="#d3dcef" />
      </linearGradient>
    </defs>

    {/* Sombra e corpo */}
    <rect x="12" y="16" width="316" height="196" rx="12" fill="#050b1a" opacity="0.45" />
    <rect x="8" y="8" width="316" height="196" rx="12" fill="url(#papel)" />

    {/* Faixa de correio aéreo */}
    <g clipPath="url(#corpo-envelope)">
      {Array.from({ length: 25 }, (_, i) => (
        <g key={i} fill={i % 2 === 0 ? '#ff5a45' : '#3b6fe0'}>
          <path d={`M${i * 14} 204 l10 -10 h7 l-10 10 z`} />
          <path d={`M${i * 14} 18 l10 -10 h7 l-10 10 z`} />
        </g>
      ))}
    </g>

    {/* Selo */}
    <g mask="url(#selo-picotado)">
      <rect x="236" y="22" width="78" height="92" fill="#ffcd3c" />
      <rect x="244" y="30" width="62" height="76" fill="none" stroke="#0f1a33" strokeWidth="1.5" opacity="0.35" />
      {/* Rosto mascarado do selo */}
      <circle cx="275" cy="62" r="17" fill="#0f1a33" />
      <path d="M260 60 q15 -9 30 0 q-3 8 -9 8 q-4 0 -6 -4 q-2 4 -6 4 q-6 0 -9 -8z" fill="#ffcd3c" />
      <text x="275" y="98" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f1a33" letterSpacing="1">
        R$ 0,00
      </text>
    </g>

    {/* Carimbo postal */}
    <g fill="none" stroke="#2a3f73" strokeWidth="2" opacity="0.7">
      <circle cx="206" cy="96" r="30" />
      <circle cx="206" cy="96" r="23" />
      <path d="M262 84 q12 -6 24 0 t24 0 M262 96 q12 -6 24 0 t24 0 M262 108 q12 -6 24 0 t24 0" />
    </g>
    <text x="206" y="94" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#2a3f73" opacity="0.8" letterSpacing="0.4">
      SEM
    </text>
    <text x="206" y="105" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#2a3f73" opacity="0.8" letterSpacing="0.4">
      ANÚNCIOS
    </text>

    {/* Destinatário */}
    <text x="36" y="132" fontSize="13" fontWeight="600" fill="#5b6c93">
      Para:
    </text>
    <text x="36" y="158" fontSize="23" fontWeight="800" fill="#0f1a33" letterSpacing="-0.5">
      todos, menos um
    </text>
    <line x1="36" y1="170" x2="210" y2="170" stroke="#9aa9c9" strokeWidth="1.5" />
  </svg>
)
