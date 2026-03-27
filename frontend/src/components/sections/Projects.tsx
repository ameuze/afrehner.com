import { Github, ExternalLink, Clock, Star } from 'lucide-react'
import type { SiteConfig, Project } from '../../types/config'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

const STATUS_CONFIG = {
  completed: { label: 'Completed', variant: 'green' as const },
  'in-progress': { label: 'In Progress', variant: 'yellow' as const },
  placeholder: { label: 'Coming Soon', variant: 'default' as const },
}

function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_CONFIG[project.status]
  const isPlaceholder = project.status === 'placeholder'

  return (
    <div className={`group relative bg-[var(--bg-surface)] border rounded-xl p-6 flex flex-col gap-4 transition-all duration-200 ${
      isPlaceholder
        ? 'border-[var(--border-subtle)] opacity-70'
        : 'border-[var(--border-subtle)] hover:border-[var(--accent-green)]/50 hover:shadow-lg hover:shadow-[var(--accent-green)]/5'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {project.featured && !isPlaceholder && (
            <Star size={14} className="text-[var(--accent-yellow)] fill-current" />
          )}
          <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-green)] transition-colors">
            {project.title}
          </h3>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1">
        {project.description.trim()}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map(tag => (
          <Badge key={tag} variant="blue">{tag}</Badge>
        ))}
      </div>

      {/* Links */}
      {!isPlaceholder && (project.github || project.demo) && (
        <div className="flex gap-2 pt-2 border-t border-[var(--border-subtle)]">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">
                <Github size={14} />
                Code
              </Button>
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">
                <ExternalLink size={14} />
                Demo
              </Button>
            </a>
          )}
        </div>
      )}

      {isPlaceholder && (
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
          <Clock size={12} />
          <span>Project details coming soon</span>
        </div>
      )}
    </div>
  )
}

export function Projects({ config }: { config: SiteConfig }) {
  const featured = config.projects.filter(p => p.featured)
  const others = config.projects.filter(p => !p.featured)

  return (
    <section id="projects" className="border-t border-[var(--border-subtle)]">
      <div className="section-container">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[var(--accent-green)] text-sm">// 03</span>
          <h2 className="text-3xl font-bold">Projects</h2>
        </div>
        <p className="text-[var(--text-muted)] mb-10 max-w-2xl">
          A selection of test automation projects. GitHub links and live demos will be added as repositories are made public.
        </p>

        {/* Featured */}
        {featured.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {featured.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}

        {/* Others */}
        {others.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
