import { PageSEO } from '@/components/SEO'
import projectsData from '@/data/projectsData'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import Image from '@/components/Image'
import Link from 'next/link'

export default function Projects() {
  const featured = projectsData.find((project) => project.featured) || projectsData[0]
  const remaining = projectsData.filter((project) => project.slug !== featured?.slug)

  return (
    <MainLayout>
      <PageSEO title={`Projects - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="space-y-8">
        <section className="apple-glass-card apple-glass-sheen mt-6 p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary-500 uppercase">
            Selected Work
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Projects
          </h1>
          <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300 md:text-lg">
            A curated set of builds that showcase systems thinking, product craft, and execution.
          </p>
        </section>

        {featured && (
          <section className="rave-tile rounded-3xl p-6 md:p-8">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary-500 uppercase">
              Featured
            </p>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  alt={featured.title}
                  src={featured.imgSrc}
                  width={1200}
                  height={675}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-primary-500/35 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
                    {featured.status}
                  </span>
                  <span className="rounded-full border border-gray-300/60 bg-white/70 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200">
                    {featured.role}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {featured.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 md:text-base">
                  {featured.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {featured.tag.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  {featured.impactMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-white/20 bg-white/40 p-3 dark:bg-black/20"
                    >
                      <p className="text-[11px] font-semibold tracking-[0.1em] text-primary-500 uppercase">
                        {metric.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/projects/${featured.slug}`} className="apple-button-primary">
                    View Case Study
                  </Link>
                  <a
                    href={featured.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-button-secondary"
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="container py-2">
          <div className="grid gap-4 md:grid-cols-2">
            {remaining.map((d) => (
              <article
                key={d.title}
                className="rave-tile rounded-2xl overflow-hidden border border-white/10"
              >
                <Image
                  alt={d.title}
                  src={d.imgSrc}
                  width={1000}
                  height={562}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-primary-500/35 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
                      {d.status}
                    </span>
                    <span className="rounded-full border border-gray-300/60 bg-white/70 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200">
                      {d.role}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{d.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{d.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {d.tag.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/projects/${d.slug}`} className="apple-button-primary">
                      Case Study
                    </Link>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apple-button-secondary"
                    >
                      Demo
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
