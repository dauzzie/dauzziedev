import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import ListLayout from '@/layouts/MDX/ListLayout'
import { JOURNAL_ACCESS_COOKIE, isJournalProtectionEnabled } from '@/lib/auth'
import { allCoreContent, sortedVisibleBlogPost } from '@/lib/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { InferGetServerSidePropsType } from 'next'
import type { GetServerSidePropsContext } from 'next'

export const POSTS_PER_PAGE = 5

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  if (isJournalProtectionEnabled()) {
    const journalAccessToken = process.env.JOURNAL_ACCESS_TOKEN
    const cookie = context.req.cookies?.[JOURNAL_ACCESS_COOKIE]
    if (cookie !== journalAccessToken) {
      return {
        redirect: {
          destination: `/journal/unlock?next=${encodeURIComponent('/journal')}`,
          permanent: false,
        },
      }
    }
  }

  const posts = sortedVisibleBlogPost(allBlogs)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return {
    props: {
      initialDisplayPosts: allCoreContent(initialDisplayPosts),
      posts: allCoreContent(posts),
      pagination,
    },
  }
}

export default function Journal({
  posts,
  initialDisplayPosts,
  pagination,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <PageSEO title={`Journal - ${siteMetadata.author}`} description={siteMetadata.description} />
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
