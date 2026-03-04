import { MDXLayoutRenderer } from '@/components/MDXComponents'
import PageTitle from '@/components/PageTitle'
import ScrollProgressBar from '@/components/ScrollProgressBar'
import MainLayout from '@/layouts/MainLayout'
import {
  CoreContent,
  coreContent,
  sortedBlogPost,
  sortedPoemPost,
  sortedVisibleBlogPost,
} from '@/lib/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import { allBlogs, allPoems } from 'contentlayer/generated'
import { GetStaticPropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const DEFAULT_LAYOUT = 'PostLayout'

interface BlogPageProps {
  post: Blog | null
  author: string
  prev: CoreContent<Blog> | null
  next: CoreContent<Blog> | null
  redirectTo?: string
}

export async function getStaticPaths() {
  // Include all historical slugs so legacy /blog links for poems can be redirected.
  const posts = [...sortedBlogPost(allBlogs), ...sortedPoemPost(allPoems)]
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug.split('/') } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }: GetStaticPropsContext<{ slug: string[] }>) => {
  if (!params?.slug) {
    return { notFound: true }
  }
  const slug = (params.slug as string[]).join('/')
  const poem = sortedPoemPost(allPoems).find((p) => p.slug === slug)
  if (poem) {
    return {
      props: {
        post: null,
        author: poem.author || 'default',
        prev: null,
        next: null,
        redirectTo: `/poetry/${slug}`,
      },
    }
  }

  const sortedPosts = sortedVisibleBlogPost(allBlogs)
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  // TODO: Refactor this extraction of coreContent
  const prevContent = sortedPosts[postIndex + 1] || null
  const prev = prevContent ? coreContent(prevContent) : null
  const nextContent = sortedPosts[postIndex - 1] || null
  const next = nextContent ? coreContent(nextContent) : null
  const post = sortedPosts.find((p) => p.slug === slug)
  if (!post) {
    return { notFound: true }
  }
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

export default function Blog({ post, author, prev, next, redirectTo }: BlogPageProps) {
  const router = useRouter()
  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo)
    }
  }, [redirectTo, router])

  return (
    <>
      {redirectTo && (
        <Head>
          <meta httpEquiv="refresh" content={`0;url=${redirectTo}`} />
          <link rel="canonical" href={redirectTo} />
        </Head>
      )}
      <ScrollProgressBar />
      <MainLayout>
        {redirectTo ? (
          <div className="mt-24 text-center">
            <PageTitle>Redirecting to Poetry...</PageTitle>
          </div>
        ) : post ? (
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
