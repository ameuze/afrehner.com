import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variantClasses = {
  primary: 'bg-[var(--accent-green)] text-[#0d1117] hover:opacity-90 font-semibold',
  secondary: 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)]',
  ghost: 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
  danger: 'bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/30 hover:bg-[var(--accent-red)]/20',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ variant = 'secondary', size = 'md', children, className = '', ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
