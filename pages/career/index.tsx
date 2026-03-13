import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import Link from 'next/link'

export default function CareerPage() {
  return (
    <MainLayout>
      <PageSEO title={`Career - ${siteMetadata.author}`} description="Career development hub." />
      <div className="space-y-8 pt-8 pb-10">
        <section className="apple-glass-card apple-glass-sheen p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary-500 uppercase">
            Career Hub
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl">
            Career Development
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-gray-600 dark:text-gray-300 md:text-base">
            This page tracks professional growth, long-term goals, and strategic learning paths.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/career" className="apple-button-primary">
              Career
            </Link>
            <Link href="/career/mba" className="apple-button-secondary">
              MBA
            </Link>
          </div>
        </section>

        <section className="rave-tile rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
            Focus Areas
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-200 md:text-base">
            <li>Senior-level macOS systems ownership and architecture influence.</li>
            <li>Shipping secure, testable products with high release reliability.</li>
            <li>Building public artifacts that clearly show engineering depth.</li>
            <li>Expanding product and business strategy range through structured study.</li>
          </ul>
        </section>
      </div>
    </MainLayout>
  )
}
