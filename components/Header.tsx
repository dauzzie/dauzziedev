import headerNavLinks from '@/data/headerNavLinks'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CommandPalette from './CommandPalette/CommandPalette'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'

export default function Header() {
  const router = useRouter()

  return (
    <header className="py-5 md:py-8 z-40 bg-transparent">
      <div className="apple-nav flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
            D
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-50 sm:block">
            dauzzie.dev
          </span>
        </Link>
        <div className="flex items-center text-base leading-5 space-x-3">
          <div className="hidden sm:flex items-center space-x-2">
            {headerNavLinks.map(({ title, href }) => {
              const active = router.pathname.includes(href)
              return (
                <Link
                  key={title}
                  href={href}
                  className={classNames('apple-nav-link', {
                    'apple-nav-link-active': active,
                  })}
                  aria-label={title}
                >
                  {title}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center">
            <CommandPalette />
            <ThemeSwitch />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
