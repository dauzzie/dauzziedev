import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import Link from 'next/link'

export default function LiftWatchSupportPage() {
  return (
    <MainLayout>
      <PageSEO
        title={`LiftWatch Support - ${siteMetadata.author}`}
        description="Support page for LiftWatch."
      />
      <div className="pt-8 pb-10 space-y-8">
        <section className="apple-glass-card apple-glass-sheen p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary-500 uppercase">
            App Support
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl">
            LiftWatch Support
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-gray-600 dark:text-gray-300 md:text-base">
            If you need help with LiftWatch, email support with your app version, device model,
            iOS/watchOS version, and a quick description of the issue.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="mailto:m.daushusaini@gmail.com" className="apple-button-primary">
              Contact Support
            </a>
            <Link href="/projects/LiftWatch/privacy" className="apple-button-secondary">
              Privacy Policy
            </Link>
          </div>
        </section>

        <section className="rave-tile rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
            Troubleshooting
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-200 md:text-base">
            <li>Force-close and reopen LiftWatch on iPhone and Apple Watch.</li>
            <li>Check Health permission access for required data.</li>
            <li>Update to the latest app version.</li>
            <li>Restart devices if sync appears delayed.</li>
          </ul>
        </section>

        <section className="apple-glass-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
            FAQ
          </h2>
          <div className="mt-4 space-y-4 text-sm text-gray-700 dark:text-gray-200 md:text-base">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                How quickly will I get a response?
              </p>
              <p>Most requests receive a reply within 2-3 business days.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                What should I include in a bug report?
              </p>
              <p>
                Include clear reproduction steps, expected behavior, and screenshots if available.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
