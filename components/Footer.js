import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="flex bg-gradient-to-r from-blue-200 dark:from-blue-500 to-purple-200 dark:to-purple-500 max-w-screen h-2 shadow mt-10"></div>
      <div className="flex flex-col items-center mt-2">
        <div className="flex bg-purple-500 max-w-screen h-2 shadow"></div>
        <div className="flex mb-3 space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} status={10} size="6" />
          <SocialIcon kind="github" href={siteMetadata.github} status={2} size="6" />
          {/* <SocialIcon kind="facebook" href={siteMetadata.facebook} status={3} size="6" /> */}
          {/* <SocialIcon kind="youtube" href={siteMetadata.youtube} status={0} size="6" /> */}
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} status={5} size="6" />
          {/* <SocialIcon kind="twitter" href={siteMetadata.twitter} status={9} size="6" /> */}
        </div>
        <div className="flex mb-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          {/* <Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">
            Tailwind Nextjs Theme
          </Link> */}
        </div>
      </div>
    </footer>
  )
}
