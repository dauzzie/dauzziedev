import NowPlaying from '@/components/Spotify/NowPlaying'
import TopTrack from '@/components/Spotify/TopTrack'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'

export default function Music() {
  return (
    <MainLayout>
      <PageSEO
        title={`Music - ${siteMetadata.author}`}
        description="Currently playing and top tracks from Spotify."
      />
      <section className="pt-6 pb-10 space-y-4">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
          Music
        </h1>
        <p className="text-lg leading-7 text-gray-600 dark:text-gray-300">
          A listening corner: what is playing now and the tracks on repeat.
        </p>
        <div className="apple-glass-card p-6">
          <NowPlaying />
        </div>
        <div className="apple-glass-card p-6">
          <TopTrack />
        </div>
      </section>
    </MainLayout>
  )
}
