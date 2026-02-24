import { LayoutDashboard, Waves, FileText, Star } from 'lucide-react'

export const adminNavItems = [
  { href: '/admin',          label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/spots',    label: 'Banen',      icon: Waves },
  { href: '/admin/articles', label: 'Artikelen',  icon: FileText },
  { href: '/admin/reviews',  label: 'Reviews',    icon: Star },
]
