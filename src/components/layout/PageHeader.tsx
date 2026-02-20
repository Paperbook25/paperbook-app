import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Breadcrumb[]
  actions?: ReactNode
  moduleColor?: string // e.g., 'behavior', 'finance', 'lms'
}

export function PageHeader({ title, description, breadcrumbs, actions, moduleColor }: PageHeaderProps) {
  return (
    <div
      className="mb-6 -mx-6 -mt-6 px-6 pt-6"
      style={moduleColor ? {
        background: `linear-gradient(to bottom, var(--color-module-${moduleColor}-light) 0%, transparent 100%)`,
      } : undefined}
    >
      {/* Module Color Accent Bar */}
      {moduleColor && (
        <div
          className="h-1 -mx-6 -mt-6 mb-4"
          style={{ backgroundColor: `var(--color-module-${moduleColor})` }}
        />
      )}
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center text-sm text-muted-foreground mb-2">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
