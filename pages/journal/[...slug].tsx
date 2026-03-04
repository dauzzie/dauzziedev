import { MDXLayoutRenderer } from '@/components/MDXComponents'
import PageTitle from '@/components/PageTitle'
import ScrollProgressBar from '@/components/ScrollProgressBar'
import MainLayout from '@/layouts/MainLayout'
import { JOURNAL_ACCESS_COOKIE } from '@/lib/auth'
import { CoreContent, coreContent, sortedVisibleBlogPost } from '@/lib/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import { allBlogs } from 'contentlayer/generated'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'

const DEFAULT_LAYOUT = 'PostLayout'

interface JournalPostPageProps {
  post: Blog | null
  author: string
  prev: CoreContent<Blog> | null
  next: CoreContent<Blog> | null
}

type Params = { slug: string[] }

export const getServerSideProps: GetServerSideProps<JournalPostPageProps, Params> = async (
  context: GetServerSidePropsContext<Params>
) => {
  const journalAccessToken = process.env.JOURNAL_ACCESS_TOKEN
  if (journalAccessToken) {
    const cookie = context.req.cookies?.[JOURNAL_ACCESS_COOKIE]
    if (cookie !== journalAccessToken) {
      const nextRoute = context.resolvedUrl || '/journal'
      return {
        redirect: {
          destination: `/journal/unlock?next=${encodeURIComponent(nextRoute)}`,
          permanent: false,
        },
      }
    }
  }

  const slugParam = context.params?.slug
  const slug = Array.isArray(slugParam) ? slugParam.join('/') : ''
  if (!slug) {
    return { notFound: true }
  }

  const sortedPosts = sortedVisibleBlogPost(allBlogs)
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  if (postIndex < 0) {
    return { notFound: true }
  }

  const post = sortedPosts[postIndex]
  const prevContent = sortedPosts[postIndex + 1] || null
  const prev = prevContent ? coreContent(prevContent) : null
  const nextContent = sortedPosts[postIndex - 1] || null
  const next = nextContent ? coreContent(nextContent) : null
  const author = post.author || 'default'

  return {
    props: {
      post,
      author,
      prev,
      next,
    },
  }
}

export default function JournalPost({ post, author, prev, next }: JournalPostPageProps) {
  if (!post) {
    return (
      <MainLayout>
        <div className="mt-24 text-center">
          <PageTitle>Loading Journal Entry...</PageTitle>
        </div>
      </MainLayout>
    )
  }

  return (
    <>
      <ScrollProgressBar />
      <MainLayout>
        <MDXLayoutRenderer
          layout={post.layout || DEFAULT_LAYOUT}
          toc={post.toc}
          content={post}
          authorDetails={author}
          prev={prev}
          next={next}
        />
      </MainLayout>
    </>
  )
}
