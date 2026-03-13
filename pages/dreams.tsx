import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'

export default function DreamsPage() {
  return (
    <MainLayout>
      <PageSEO title={`Dreams - ${siteMetadata.author}`} description="A personal long-term vision." />
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
        <div className="dream-quote-card rounded-3xl px-8 py-10 md:px-12 md:py-14">
          <p className="max-w-4xl text-center text-xl italic text-gray-100 md:text-3xl">
            "Here lies Dausi dreams of opening a tech business surrounded with chickens and ducks among
            trees and bushes that sits between a city and the forest."
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
