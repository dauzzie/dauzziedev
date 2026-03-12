import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import Link from 'next/link'

export default function LiftWatchPrivacyPage() {
  return (
    <MainLayout>
      <PageSEO
        title={`LiftWatch Privacy Policy - ${siteMetadata.author}`}
        description="Privacy policy for LiftWatch."
      />
      <div className="pt-8 pb-10 space-y-8">
        <section className="apple-glass-card apple-glass-sheen p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary-500 uppercase">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl">
            LiftWatch Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Effective date: March 12, 2026
          </p>
          <p className="mt-4 max-w-3xl text-sm text-gray-600 dark:text-gray-300 md:text-base">
            LiftWatch is designed with privacy in mind. We minimize data collection and only access
            device data required to deliver core app features.
          </p>
          <div className="mt-6">
            <Link href="/projects/LiftWatch/support" className="apple-button-secondary">
              Back to Support
            </Link>
          </div>
        </section>

        <section className="rave-tile rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
            Information We Access
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-200 md:text-base">
            <li>Health and activity data you explicitly authorize through Apple HealthKit.</li>
            <li>Basic app diagnostics needed to maintain reliability.</li>
          </ul>
        </section>

        <section className="apple-glass-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
            How Data Is Used
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-200 md:text-base">
            <li>To show your workout and progress insights inside the app.</li>
            <li>To improve app stability and fix issues.</li>
          </ul>
        </section>

        <section className="apple-glass-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
            Data Sharing and Retention
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-200 md:text-base">
            <li>LiftWatch does not sell personal data.</li>
            <li>Health data remains on-device unless you choose features that sync externally.</li>
            <li>Support emails are retained only as needed to resolve your request.</li>
          </ul>
        </section>

        <section className="rave-tile rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
            Contact
          </h2>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-200 md:text-base">
            For privacy questions or requests, contact:
          </p>
          <a href="mailto:m.daushusaini@gmail.com" className="underline-magical mt-3 inline-block">
            m.daushusaini@gmail.com
          </a>
        </section>
      </div>
    </MainLayout>
  )
}
