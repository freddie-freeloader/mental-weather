interface Props {
  className?: string
}

export function PansyMark({ className = "pansy" }: Props) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M32 62V50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M32 54c-8 1-13 6-15 11 7-2 11-6 15-11z" fill="currentColor" />
      <g fill="currentColor">
        <ellipse cx="24" cy="20" rx="9" ry="12" transform="rotate(-28 24 20)" />
        <ellipse cx="40" cy="20" rx="9" ry="12" transform="rotate(28 40 20)" />
        <ellipse cx="16" cy="32" rx="8" ry="11" transform="rotate(-62 16 32)" />
        <ellipse cx="48" cy="32" rx="8" ry="11" transform="rotate(62 48 32)" />
        <ellipse cx="32" cy="40" rx="12" ry="14" />
      </g>
      <circle className="pansy-face" cx="32" cy="34" r="3" />
      <path
        className="pansy-face"
        d="M32 36v6M28 40c2 2 6 2 8 0"
        fill="none"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}
