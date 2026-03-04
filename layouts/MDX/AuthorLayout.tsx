import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import type { Authors } from 'contentlayer/generated'
import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, linkedin, github } = content

  return (
    <>
      <PageSEO title={`About - ${name}`} description={`About me - ${name}`} />
      <div className="about-shell pt-8 pb-6 space-y-6">
        <section className="apple-glass-card apple-glass-sheen p-6 md:p-8">
          <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row sm:items-center">
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary-500 uppercase">
                About
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 md:text-4xl lg:text-5xl">
                {name}
              </h1>
              <h2 className="mt-2 text-sm text-gray-700 md:text-base dark:text-gray-200">
                {occupation} <span className="font-semibold text-primary-500">{company}</span>
              </h2>
            </div>
            <div className="about-avatar-wrap">
              <Image
                alt={`${name} profile image`}
                height={144}
                width={144}
                src={avatar || ''}
                className="about-avatar object-cover rounded-full"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={siteMetadata.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-button-primary"
            >
              Resume PDF
            </a>
            <a href={siteMetadata.resumeUrl} download className="apple-button-secondary">
              Download Resume
            </a>
            {linkedin && (
              <Link href={linkedin} className="apple-button-secondary">
                LinkedIn
              </Link>
            )}
            {github && (
              <Link href={github} className="apple-button-secondary">
                GitHub
              </Link>
            )}
            {email && (
              <Link href={`mailto:${email}`} className="apple-button-primary">
                Email
              </Link>
            )}
          </div>
        </section>

        <section className="rave-tile rounded-3xl px-5 py-4 md:px-6 md:py-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary-500 uppercase">
            Focus Areas
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              'macOS Systems',
              'Swift + Objective-C/C++',
              'XPC & Daemon/UI',
              'CI/CD & Quality',
              'Security-Critical Delivery',
              'AI Product Integration',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="apple-glass-card p-6 md:p-8">
          <div className="about-prose prose dark:prose-dark max-w-none">{children}</div>
        </section>
      </div>
    </>
  )
}
