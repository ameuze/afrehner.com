interface Props {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'red' | 'blue' | 'yellow'
}

const variantClasses = {
  default: 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)]',
  green: 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border-[var(--accent-green)]/30',
  red: 'bg-[var(--accent-red)]/10 text-[var(--accent-red)] border-[var(--accent-red)]/30',
  blue: 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border-[var(--accent-blue)]/30',
  yellow: 'bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)] border-[var(--accent-yellow)]/30',
}

export function Badge({ children, variant = 'default' }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}
