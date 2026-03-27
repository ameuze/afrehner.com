import type { ReactNode } from 'react'

interface Props {
  title?: string
  children: ReactNode
  className?: string
  showCursor?: boolean
  height?: string
}

export function TerminalWindow({ title = 'terminal', children, className = '', showCursor = false, height }: Props) {
  return (
    <div className={`rounded-lg border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-surface)] ${className}`}>
      {/* Traffic light header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28ca41]" />
        <span className="ml-3 text-xs text-[var(--text-muted)] font-mono">{title}</span>
      </div>
      <div className="p-4 font-mono text-sm leading-relaxed overflow-auto relative" style={height ? { height } : undefined}>
        {children}
        {showCursor && (
          <span className="inline-block w-2 h-4 bg-[var(--accent-green)] animate-blink ml-0.5 align-middle" />
        )}
      </div>
    </div>
  )
}
