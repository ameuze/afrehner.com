import { useEffect, useRef } from 'react'
import type { OutputLine } from '../../hooks/useTestRunner'

interface Props {
  lines: OutputLine[]
}

function colorize(text: string): { text: string; className: string }[] {
  // Simple ANSI-aware colorizer for Playwright output
  // Maps common patterns to color classes
  const parts: { text: string; className: string }[] = []

  // Strip ANSI escape codes and classify lines
  const stripped = text.replace(/\x1b\[[0-9;]*m/g, '')

  if (/✓|passed|PASSED|ok/.test(stripped)) {
    parts.push({ text: stripped, className: 'text-[var(--accent-green)]' })
  } else if (/✗|✘|failed|FAILED|error|Error/.test(stripped)) {
    parts.push({ text: stripped, className: 'text-[var(--accent-red)]' })
  } else if (/^\s+\d+ (passed|failed|skipped)/.test(stripped)) {
    parts.push({ text: stripped, className: 'text-[var(--accent-blue)]' })
  } else if (/Running|Chromium|Firefox|WebKit|workers/.test(stripped)) {
    parts.push({ text: stripped, className: 'text-[var(--accent-blue)]' })
  } else {
    parts.push({ text: stripped, className: 'text-[var(--text-muted)]' })
  }

  return parts
}

export function TestOutput({ lines }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines.length])

  if (lines.length === 0) return null

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      {lines.map((line, i) => {
        const colored = colorize(line.chunk)
        return (
          <div key={i} className="leading-relaxed whitespace-pre-wrap break-words">
            {colored.map((part, j) => (
              <span key={j} className={part.className}>{part.text}</span>
            ))}
          </div>
        )
      })}
    </div>
  )
}
