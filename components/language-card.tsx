import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface LanguageCardProps {
  name: string
  icon: string
  href: string
}

export function LanguageCard({ name, icon, href }: LanguageCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" role="img" aria-label={name}>
          {icon}
        </span>
        <span className="font-medium">{name}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  )
}
