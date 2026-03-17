import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import { useState } from 'react'

export default function DreamsPage() {
  const [waveKey, setWaveKey] = useState(0)

  const triggerWave = () => setWaveKey((prev) => prev + 1)

  return (
    <MainLayout>
      <PageSEO
        title={`Dreams - ${siteMetadata.author}`}
        description="A personal long-term vision."
      />
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
        <div
          className="dream-quote-card rounded-3xl px-8 py-10 md:px-12 md:py-14"
          role="button"
          tabIndex={0}
          onClick={triggerWave}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              triggerWave()
            }
          }}
          aria-label="Trigger dream color wave"
        >
          {waveKey > 0 ? <span key={waveKey} className="dream-wave-layer" /> : null}
          <p className="max-w-4xl text-center text-xl italic text-gray-100 md:text-3xl">
            "Here lies Dausi dreams of opening a tech business surrounded with chickens and ducks
            among trees and bushes that sits between a city and the forest."
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
