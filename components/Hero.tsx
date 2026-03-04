import { motion } from 'framer-motion'
import siteMetadata from '@/data/siteMetadata'
import Link from 'next/link'
import { ReactElement } from 'react'

export default function Hero(): ReactElement {
  return (
    <section className="relative overflow-hidden">
      <h1 className="sr-only">
        Hello I'm Dausi Husaini, I'm a software engineer, and I love building things for the web.
      </h1>
      <motion.div
        className="apple-hero-orb apple-hero-orb-blue"
        animate={{ x: [0, 18, -6, 0], y: [0, -12, 10, 0], scale: [1, 1.06, 0.97, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="apple-hero-orb apple-hero-orb-cyan"
        animate={{ x: [0, -14, 6, 0], y: [0, 12, -8, 0], scale: [1, 0.96, 1.04, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="relative z-10 flex min-h-[calc(86vh-81px)] md:min-h-[calc(88vh-116px)] items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-screen px-4 max-w-3xl mx-auto sm:px-9 xl:max-w-5xl xl:px-0">
          <motion.div
            className="apple-glass-card apple-glass-sheen p-8 md:p-12"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
          >
            <p className="text-sm font-semibold tracking-[0.16em] text-primary-500 uppercase">
              Story + Career Lab
            </p>
            <h2
              className="rave-title mt-4 text-5xl font-semibold tracking-tight text-gray-950 dark:text-gray-50 sm:text-7xl"
              data-text={siteMetadata.author}
            >
              {siteMetadata.author}
            </h2>
            <p className="mt-5 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
              {siteMetadata.slogan}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={siteMetadata.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-button-primary"
              >
                View Resume
              </a>
              <Link href="/journal" className="apple-button-primary">
                Enter Journal
              </Link>
              <Link href="/about" className="apple-button-secondary">
                Career Timeline
              </Link>
            </div>
            <div className="rave-tile mt-6 rounded-2xl border border-primary-500/30 p-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-primary-500 uppercase">
                Resume Spotlight
              </p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                Senior Software Engineer (macOS / Systems): architecture, platform reliability,
                CI/CD, and security-critical delivery.
              </p>
              <div className="mt-3">
                <a
                  href={siteMetadata.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-magical text-sm font-semibold"
                >
                  Open full resume &rarr;
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
