import Tag from '@/components/Tag'
import { CoreContent } from '@/lib/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import { motion } from 'framer-motion'
import Link from 'next/link'

export interface PostCardProps {
  posts: CoreContent<Blog>[]
  showTags?: boolean
  linkPrefix?: '/journal' | '/poetry'
}

export default function PostCard({
  posts,
  showTags = true,
  linkPrefix = '/journal',
}: PostCardProps) {
  return (
    <ul>
      {posts.map(({ slug, title, tags, summary }, index) => (
        <motion.li
          key={slug}
          className="py-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: index / 10 }}
        >
          <article className="space-y-2 gap-3 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline bg-opacity-20 py-5">
            <div className="space-y-3 xl:col-span-4">
              <h2 className="text-2xl font-bold leading-8 tracking-tight">
                <Link
                  href={`${linkPrefix}/${slug}`}
                  aria-label={`Read "${title}"`}
                  className="text-primary-500 hover:text-primary-400 duration-300"
                >
                  {title}
                </Link>
              </h2>
              {showTags && tags && (
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              )}
              <div className="prose text-gray-900 dark:text-gray-100 max-w-none">{summary}</div>
            </div>
          </article>
        </motion.li>
      ))}
    </ul>
  )
}
