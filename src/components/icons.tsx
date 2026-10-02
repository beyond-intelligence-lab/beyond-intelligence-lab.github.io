import {
  ArrowRight,
  Blocks,
  Code,
  ExternalLink,
  FileText,
  Info,
  Languages,
  Menu,
  Microscope,
  Moon,
  Presentation,
  Sun,
  X,
} from 'lucide-react'

export type IconProps = { className?: string }

/** Keep the site's icon sizing, stroke weight, and decorative semantics. */
const base = {
  size: 18,
  strokeWidth: 1.7,
  'aria-hidden': true,
  focusable: false,
}

export function SunIcon({ className }: IconProps) {
  return <Sun {...base} className={className} />
}

export function MoonIcon({ className }: IconProps) {
  return <Moon {...base} className={className} />
}

export function MenuIcon({ className }: IconProps) {
  return <Menu {...base} className={className} />
}

export function CloseIcon({ className }: IconProps) {
  return <X {...base} className={className} />
}

export function LanguagesIcon({ className }: IconProps) {
  return <Languages {...base} className={className} />
}

export function ArrowRightIcon({ className }: IconProps) {
  return <ArrowRight {...base} className={className} />
}

/** Paper / arXiv links, and the placeholder on cards without a thumbnail. */
export function FileTextIcon({ className }: IconProps) {
  return <FileText {...base} className={className} />
}

export function CodeIcon({ className }: IconProps) {
  return <Code {...base} className={className} />
}

export function SlidesIcon({ className }: IconProps) {
  return <Presentation {...base} className={className} />
}

export function ExternalLinkIcon({ className }: IconProps) {
  return <ExternalLink {...base} className={className} />
}

export function InfoIcon({ className }: IconProps) {
  return <Info {...base} className={className} />
}

export function ResearchIcon({ className }: IconProps) {
  return <Microscope {...base} className={className} />
}

export function ProjectsIcon({ className }: IconProps) {
  return <Blocks {...base} className={className} />
}
