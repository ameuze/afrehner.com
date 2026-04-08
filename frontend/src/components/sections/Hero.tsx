import { useEffect, useState } from 'react'
import { Github, Linkedin, Twitter, ChevronDown } from 'lucide-react'
import type { SiteConfig } from '../../types/config'
import { Button } from '../ui/Button'

const TYPED_STRINGS = [
  'playwright test',
  'npm test',
  'playwright test --headed'
]

function useTypingEffect(strings: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>('typing')
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    const current = strings[idx]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (charIdx < current.length) {
        timeout = setTimeout(() => {
          setDisplay(current.slice(0, charIdx + 1))
          setCharIdx(c => c + 1)
        }, speed)
      } else {
        timeout = setTimeout(() => setPhase('pausing'), pause)
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('erasing'), 200)
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setDisplay(current.slice(0, charIdx - 1))
          setCharIdx(c => c - 1)
        }, speed / 2)
      } else {
        setIdx(i => (i + 1) % strings.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timeout)
  }, [phase, charIdx, idx, strings, speed, pause])

  return display
}

export function Hero({ config }: { config: SiteConfig }) {
  const { personal, social } = config
  const typedCmd = useTypingEffect(TYPED_STRINGS)

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="section-container relative z-10">
        <div className="max-w-4xl">
          {/* Terminal prompt line */}
          <div className="font-mono text-sm text-[var(--text-muted)] mb-6 flex items-center gap-2">
            <span className="text-[var(--accent-green)]">❯</span>
            <span className="text-[var(--accent-blue)]">npx</span>
            <span className="text-[var(--text-primary)]">{typedCmd}</span>
            <span className="inline-block w-1.5 h-4 bg-[var(--accent-green)] animate-blink" />
          </div>

          {/* Name */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight tracking-tight">
            <span className="text-[var(--text-primary)]">{personal.name}</span>
          </h1>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--accent-green)] mb-6">
            {personal.title}
          </h2>

          {/* Tagline */}
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mb-8 leading-relaxed">
            {personal.tagline}
          </p>

          {/* Location */}
          {personal.location && (
            <p className="text-sm text-[var(--text-muted)] font-mono mb-8">
              📍 {personal.location}
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-12">
<a href="#test-runner">
              <Button variant="secondary" size="lg">
                <span className="text-[var(--accent-green)]">▶</span>
                Watch Tests Run Live
              </Button>
            </a>
            <a href="#contact">
              <Button variant="ghost" size="lg">
                Get in Touch
              </Button>
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-5">
            {social.github && (
              <a href={social.github} target="_blank" rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 text-sm">
                <Github size={18} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 text-sm">
                <Linkedin size={18} />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 text-sm">
                <Twitter size={18} />
                <span className="hidden sm:inline">Twitter</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors animate-bounce">
        <ChevronDown size={24} />
      </a>
    </section>
  )
}
