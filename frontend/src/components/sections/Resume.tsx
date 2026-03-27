import { FileText, Download, ExternalLink } from 'lucide-react'
import type { SiteConfig } from '../../types/config'
import { Button } from '../ui/Button'

export function Resume({ config }: { config: SiteConfig }) {
  const { resume } = config
  const hasResume = resume.url && resume.url !== 'PLACEHOLDER_RESUME_URL'

  return (
    <section id="resume" className="border-t border-[var(--border-subtle)]">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-[var(--accent-green)] text-sm">// 04</span>
          <h2 className="text-3xl font-bold">Resume</h2>
        </div>

        <div className="max-w-2xl">
          {hasResume ? (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-8 text-center">
              <FileText size={48} className="text-[var(--accent-green)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">My Resume</h3>
              <p className="text-[var(--text-muted)] mb-6">
                View or download my full resume including experience, education, and certifications.
              </p>
              <div className="flex justify-center gap-3">
                <a href={resume.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="lg">
                    <ExternalLink size={16} />
                    View Resume
                  </Button>
                </a>
                <a href={resume.url} download>
                  <Button variant="secondary" size="lg">
                    <Download size={16} />
                    Download PDF
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--bg-surface)] border border-dashed border-[var(--border-subtle)] rounded-xl p-12 text-center">
              <FileText size={48} className="text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-muted)]">Resume Coming Soon</h3>
              <p className="text-[var(--text-muted)] text-sm">
                Update <code className="bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded text-xs">config.yaml</code> with your resume URL to display it here.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
