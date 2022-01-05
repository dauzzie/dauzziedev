import '@/css/tailwind.css'
import '@/css/prism.css'

import { ThemeProvider } from 'next-themes'
import Head from 'next/head'

import siteMetadata from '@/data/siteMetadata'
import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ClientReload } from '@/components/ClientReload'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot} from "recoil"

const isDevelopment = process.env.NODE_ENV === 'development'
const isSocket = process.env.SOCKET

export default function App({ Component, pageProps: {session, ...pageProps}, ...appProps }) {
  const getContent = () => {
    if([`/login`].includes(appProps.router.pathname)) {
      return <Component {...pageProps}/>
    }
    return (
      <LayoutWrapper>
        <Component {...pageProps}/>{" "}
      </LayoutWrapper>
    )
  }
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <SessionProvider session={session}>
        <RecoilRoot>
        {getContent()}
        </RecoilRoot>
      </SessionProvider>
    </ThemeProvider>
  )
}
