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
      className="soft-surface group flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors hover:border-primary/40 hover:bg-card/80"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/70 text-2xl"
          role="img"
          aria-label={name}
        >
          {icon}
        </span>
        <span className="font-medium">{name}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
    </Link>
  )
}
