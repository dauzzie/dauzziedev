import formatDate from '@/lib/utils/formatDate'
import { CoreContent } from '@/lib/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface CareerHubProps {
  posts: CoreContent<Blog>[]
}

const careerHighlights = [
  {
    period: 'Now',
    title: 'Software Engineer, OpenText',
    summary: 'Building resilient automation, deployment flows, and dependable product systems.',
  },
  {
    period: 'Previously',
    title: 'Game Developer, Field Day Lab',
    summary: 'Shipped educational games in Unity/C# with interaction-heavy mechanics.',
  },
  {
    period: 'Foundation',
    title: 'Backend + Integrations',
    summary: 'Built APIs, integration layers, and CI/CD workflows across teams and clients.',
  },
]

const capabilityTags = [
  'Automation',
  'CI/CD',
  'Swift',
  'Python',
  'Unity/C#',
  'APIs',
  'System Design',
  'Frontend Craft',
]

export default function CareerHub({ posts }: CareerHubProps) {
  const featuredPosts = posts.slice(0, 3)

  return (
    <section className="space-y-12 py-8">
      <motion.div
        className="apple-glass-card apple-glass-sheen p-6 md:p-8"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary-500 uppercase">
              Story Hub
            </p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
              Engineering posts and poems from the build process.
            </h3>
          </div>
          <Link href="/blog" className="apple-button-secondary w-max">
            Browse all writing
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featuredPosts.map((post) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="rave-tile group block rounded-2xl p-4 transition"
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {formatDate(post.date)}
                </p>
                <h4 className="mt-2 text-lg font-semibold text-gray-900 transition group-hover:text-primary-500 dark:text-gray-100">
                  {post.title}
                </h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{post.summary}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid gap-6 lg:grid-cols-5"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="apple-glass-card apple-glass-sheen p-6 lg:col-span-3">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary-500 uppercase">
            Career Development
          </p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            Engineering impact beyond UI.
          </h3>
          <div className="mt-6 space-y-4">
            {careerHighlights.map((item) => (
              <div key={item.title} className="rave-tile rounded-2xl p-4">
                <p className="text-xs font-semibold tracking-[0.14em] text-primary-500 uppercase">
                  {item.period}
                </p>
                <h4 className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="apple-glass-card apple-glass-sheen p-6 lg:col-span-2">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary-500 uppercase">
            Capability Stack
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            Systems, automation, product craft.
          </h3>
          <div className="mt-6 flex flex-wrap gap-2">
            {capabilityTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary-500/25 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="rave-tile mt-6 rounded-2xl p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary-500 uppercase">
              Local Companion
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Use the macOS writer app in `macos/DauzzieWriter` to create blog and poem drafts
              directly into this website.
            </p>
          </div>
          <Link href="/about" className="apple-button-primary mt-6 w-max">
            View full background
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
