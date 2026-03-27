import { useEffect, useRef, useState } from 'react'
import { Terminal, Code, Settings, CheckCircle } from 'lucide-react'
import type { SiteConfig, SkillCategory } from '../../types/config'
import { Badge } from '../ui/Badge'

const ICON_MAP: Record<string, React.ReactNode> = {
  terminal: <Terminal size={18} />,
  code: <Code size={18} />,
  settings: <Settings size={18} />,
  'check-circle': <CheckCircle size={18} />,
}

function SkillBar({ name, level }: { name: string; level: number }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-primary)]">{name}</span>
        <span className="text-[var(--text-muted)] font-mono text-xs">{level}%</span>
      </div>
      <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)] rounded-full transition-all duration-1000 ease-out"
          style={{ width: animated ? `${level}%` : '0%' }}
        />
      </div>
    </div>
  )
}

function CategoryCard({ category }: { category: SkillCategory }) {
  const hasBars = category.items.some(item => typeof item.level === 'number')

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6 hover:border-[var(--accent-green)]/40 transition-colors">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[var(--accent-green)]">
          {ICON_MAP[category.icon] ?? <Terminal size={18} />}
        </span>
        <h3 className="font-semibold text-[var(--text-primary)]">{category.name}</h3>
      </div>

      {hasBars ? (
        <div className="space-y-4">
          {category.items.map(item => (
            typeof item.level === 'number'
              ? <SkillBar key={item.name} name={item.name} level={item.level} />
              : <p key={item.name} className="text-sm text-[var(--text-muted)]">{item.name}</p>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {category.items.map(item => (
            <Badge key={item.name} variant="default">{item.name}</Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export function Skills({ config }: { config: SiteConfig }) {
  return (
    <section id="skills" className="border-t border-[var(--border-subtle)]">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-[var(--accent-green)] text-sm">// 02</span>
          <h2 className="text-3xl font-bold">Skills</h2>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {config.skills.categories.map(category => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
