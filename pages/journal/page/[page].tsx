import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import ListLayout from '@/layouts/MDX/ListLayout'
import { JOURNAL_ACCESS_COOKIE } from '@/lib/auth'
import { allCoreContent, sortedVisibleBlogPost } from '@/lib/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'
import { POSTS_PER_PAGE } from '../../journal'

type Params = { page: string }

export const getServerSideProps = async (context: GetServerSidePropsContext<Params>) => {
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

  const page = context.params?.page
  if (!page) {
    return { notFound: true }
  }

  const pageNumber = Number.parseInt(page, 10)
  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    return { notFound: true }
  }

  const posts = sortedVisibleBlogPost(allBlogs)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (pageNumber > totalPages) {
    return { notFound: true }
  }

  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  return {
    props: {
      initialDisplayPosts: allCoreContent(initialDisplayPosts),
      posts: allCoreContent(posts),
      pagination,
    },
  }
}

export default function JournalPage({
  posts,
  initialDisplayPosts,
  pagination,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="Journal"
        linkPrefix="/journal"
      />
    </MainLayout>
  )
}
