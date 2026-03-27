import { useState, useEffect } from 'react'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#test-runner', label: 'Live Demo' },
  { href: '#contact', label: 'Contact' },
]

export function Navbar({ name }: { name: string }) {
  const { theme, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[var(--bg-primary)]/95 backdrop-blur border-b border-[var(--border-subtle)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / name */}
        <a
          href="#hero"
          className="font-mono text-[var(--accent-green)] font-semibold text-sm hover:opacity-80 transition-opacity"
        >
          {`~/${name.split(' ')[0].toLowerCase()}`}
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg text-[var(--text-muted)]" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setMenuOpen(o => !o)} className="p-2 rounded-lg text-[var(--text-muted)]" aria-label="Menu">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
