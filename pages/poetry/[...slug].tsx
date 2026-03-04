import { MDXLayoutRenderer } from '@/components/MDXComponents'
import PageTitle from '@/components/PageTitle'
import ScrollProgressBar from '@/components/ScrollProgressBar'
import MainLayout from '@/layouts/MainLayout'
import { POETRY_ACCESS_COOKIE } from '@/lib/auth'
import { CoreContent, coreContent, sortedPoetryPost } from '@/lib/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import { allBlogs } from 'contentlayer/generated'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'

const DEFAULT_LAYOUT = 'PostLayout'

interface PoetryPostPageProps {
  post: Blog
  author: string
  prev: CoreContent<Blog> | null
  next: CoreContent<Blog> | null
}

type Params = { slug: string[] }

export const getServerSideProps: GetServerSideProps<PoetryPostPageProps, Params> = async (
  context: GetServerSidePropsContext<Params>
) => {
  const poetryAccessToken = process.env.POETRY_ACCESS_TOKEN
  if (poetryAccessToken) {
    const cookie = context.req.cookies?.[POETRY_ACCESS_COOKIE]
    if (cookie !== poetryAccessToken) {
      const nextRoute = context.resolvedUrl || '/poetry'
      return {
        redirect: {
          destination: `/poetry/unlock?next=${encodeURIComponent(nextRoute)}`,
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

  const sortedPosts = sortedPoetryPost(allBlogs)
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

export default function PoetryPost({
  post,
  author,
  prev,
  next,
}: PoetryPostPageProps) {
  return (
    <>
      <ScrollProgressBar />
      <MainLayout>
        {post ? (
          <MDXLayoutRenderer
            layout={post.layout || DEFAULT_LAYOUT}
            toc={post.toc}
            content={post}
            authorDetails={author}
            prev={prev}
            next={next}
          />
        ) : (
          <div className="mt-24 text-center">
            <PageTitle>
              Under Construction{' '}
              <span role="img" aria-label="roadwork sign">
                🚧
              </span>
            </PageTitle>
          </div>
        )}
      </MainLayout>
    </>
  )
}
