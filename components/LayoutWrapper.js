import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'

const LayoutWrapper = ({ children }) => {
  return (
    <SectionContainer>
      <div className="flex flex-col justify-between h-screen">
        <header className="flex items-center justify-between py-4 px-1 sm:flex-row">
          <div>
            <Link href="/" aria-label="Dauzzie">
              <div className="flex items-center justify-between">
                <div className="mr-3">
                  {/* <Logo /> */}
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="h-6 text-2xl font-semibold sm:block">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-bold text-gray-900 dark:text-gray-100 sm:p-4 hover:text-purple-500 transition-colors duration-200 dark:hover:text-purple-500 dark:duration-200"
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
            <MobileNav />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
          <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
