import { ExternalLink } from 'lucide-react'
import { Button } from '../ui/Button'

interface Props {
  reportUrl: string
}

export function ReportViewer({ reportUrl }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
        <span className="text-sm font-mono text-[var(--text-muted)]">Playwright HTML Report</span>
        <a href={reportUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm">
            <ExternalLink size={12} />
            Open in tab
          </Button>
        </a>
      </div>
      <iframe
        src={reportUrl}
        title="Playwright HTML Report"
        className="w-full bg-white"
        style={{ height: '600px' }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}
