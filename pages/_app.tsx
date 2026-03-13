import '@/css/prism.css'
import '@/css/tailwind.css'

import LogRocket from '@/components/Logrocket'
import ProgressBar from '@/components/ProgressBar'
import { ScrollObserver } from '@/components/ScrollObserver'
import siteMetadata from '@/data/siteMetadata'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const path = router.asPath
    const isPoetryRoute = path.startsWith('/poetry')
    const isMusicRoute = path.startsWith('/music')
    const isProjectRoute = path.startsWith('/projects')
    const isDreamRoute = path.startsWith('/dreams')

    document.body.classList.toggle('poetry-mode', isPoetryRoute)
    document.body.classList.toggle('music-mode', isMusicRoute)
    document.body.classList.toggle('project-mode', isProjectRoute)
    document.body.classList.toggle('dream-mode', isDreamRoute)

    return () => {
      document.body.classList.remove('poetry-mode')
      document.body.classList.remove('music-mode')
      document.body.classList.remove('project-mode')
      document.body.classList.remove('dream-mode')
    }
  }, [router.asPath])

  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <AnimatePresence exitBeforeEnter initial={false}>
        <ScrollObserver>
          <LogRocket />
          <ProgressBar />
          <Component {...pageProps} />
        </ScrollObserver>
      </AnimatePresence>
    </ThemeProvider>
  )
}
