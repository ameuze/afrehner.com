import { CheckCircle } from 'lucide-react'
import type { SiteConfig } from '../../types/config'

export function About({ config }: { config: SiteConfig }) {
  const { about, personal } = config

  return (
    <section id="about" className="border-t border-[var(--border-subtle)]">
      <div className="section-container">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Text content */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[var(--accent-green)] text-sm">// 01</span>
              <h2 className="text-3xl font-bold">About Me</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              {about.bio.trim().split('\n\n').map((para, i) => (
                <p key={i} className="text-[var(--text-muted)] leading-relaxed mb-4">
                  {para.trim()}
                </p>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="md:col-span-2">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
              <h3 className="font-mono text-sm text-[var(--text-muted)] mb-4 uppercase tracking-widest">
                Key Strengths
              </h3>
              <ul className="space-y-3">
                {about.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle size={16} className="text-[var(--accent-green)] mt-0.5 shrink-0" />
                    <span className="text-[var(--text-primary)]">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Quick stats */}
              <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="font-mono text-2xl font-bold text-[var(--accent-green)]">E2E</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">Specialist</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-2xl font-bold text-[var(--accent-blue)]">POM</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">Architecture</div>
                </div>
              </div>
            </div>

            {/* Contact card */}
            <div className="mt-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6">
              <h3 className="font-mono text-sm text-[var(--text-muted)] mb-3 uppercase tracking-widest">
                Contact
              </h3>
              <a href={`mailto:${personal.email}`} className="text-[var(--accent-blue)] hover:underline text-sm">
                {personal.email}
              </a>
              {personal.location && (
                <p className="text-sm text-[var(--text-muted)] mt-2">📍 {personal.location}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
