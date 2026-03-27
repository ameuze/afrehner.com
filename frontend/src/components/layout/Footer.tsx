import { Github, Linkedin, Twitter } from 'lucide-react'
import type { SiteConfig } from '../../types/config'

export function Footer({ config }: { config: SiteConfig }) {
  const { personal, social } = config
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-muted)] font-mono">
          <span className="text-[var(--accent-green)]">©</span> {year} {personal.name} — Built with React &amp; TypeScript
        </p>
        <div className="flex items-center gap-4">
          {social.github && (
            <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <Github size={18} />
            </a>
          )}
          {social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <Linkedin size={18} />
            </a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <Twitter size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
