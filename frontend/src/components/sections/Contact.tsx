import { Mail, Github, Linkedin, Twitter, MapPin } from 'lucide-react'
import type { SiteConfig } from '../../types/config'

export function Contact({ config }: { config: SiteConfig }) {
  const { personal, social } = config

  return (
    <section id="contact" className="border-t border-[var(--border-subtle)]">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[var(--accent-green)] text-sm">// 06</span>
          <h2 className="text-3xl font-bold">Get In Touch</h2>
        </div>
        <p className="text-[var(--text-muted)] mb-10 max-w-2xl">
          I'm currently open to new opportunities. Whether you have a question, a project, or just want to connect — my inbox is always open.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--text-muted)] uppercase text-xs tracking-widest font-mono mb-6">
              Direct Contact
            </h3>

            <a href={`mailto:${personal.email}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-green)]/50 transition-colors group">
              <Mail size={20} className="text-[var(--accent-green)]" />
              <div>
                <div className="text-xs text-[var(--text-muted)] mb-0.5">Email</div>
                <div className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-green)] transition-colors">
                  {personal.email}
                </div>
              </div>
            </a>

            {personal.location && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                <MapPin size={20} className="text-[var(--accent-blue)]" />
                <div>
                  <div className="text-xs text-[var(--text-muted)] mb-0.5">Location</div>
                  <div className="text-sm text-[var(--text-primary)]">{personal.location}</div>
                </div>
              </div>
            )}
          </div>

          {/* Social links */}
          <div>
            <h3 className="font-semibold text-[var(--text-muted)] uppercase text-xs tracking-widest font-mono mb-6">
              Social Profiles
            </h3>
            <div className="space-y-4">
              {social.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-green)]/50 transition-colors group">
                  <Github size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent-green)]" />
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-0.5">GitHub</div>
                    <div className="text-sm text-[var(--text-primary)]">{social.github.replace('https://github.com/', '@')}</div>
                  </div>
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50 transition-colors group">
                  <Linkedin size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent-blue)]" />
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-0.5">LinkedIn</div>
                    <div className="text-sm text-[var(--text-primary)]">{social.linkedin.replace('https://linkedin.com/in/', '')}</div>
                  </div>
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)]/50 transition-colors group">
                  <Twitter size={20} className="text-[var(--text-muted)]" />
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-0.5">Twitter / X</div>
                    <div className="text-sm text-[var(--text-primary)]">{social.twitter}</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
