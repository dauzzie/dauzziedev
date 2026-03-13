import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import Link from 'next/link'

export default function CareerVisionPage() {
  return (
    <MainLayout>
      <PageSEO title={`Vision - ${siteMetadata.author}`} description="Long-term vision." />
      <div className="space-y-8 pt-8 pb-10">
        <section className="apple-glass-card apple-glass-sheen p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary-500 uppercase">
            Career Hub
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl">
            Vision
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/career" className="apple-button-secondary">
              Career
            </Link>
            <Link href="/career/mba" className="apple-button-secondary">
              MBA
            </Link>
            <Link href="/career/vision" className="apple-button-primary">
              Vision
            </Link>
            <Link href="/dreams" className="apple-button-secondary">
              Quote Page
            </Link>
          </div>
        </section>

        <section className="apple-glass-card p-8 text-center md:p-12">
          <p className="text-lg italic text-gray-700 dark:text-gray-200 md:text-2xl">
            "Here lies Dausi dreams of opening a tech business surrounded with chickens and ducks
            among trees and bushes that sits between a city and the forest."
          </p>
        </section>
      </div>
    </MainLayout>
  )
}
