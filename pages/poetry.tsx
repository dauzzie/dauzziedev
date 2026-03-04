import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import ListLayout from '@/layouts/MDX/ListLayout'
import { POETRY_ACCESS_COOKIE } from '@/lib/auth'
import { allCoreContent, sortedPoemPost } from '@/lib/utils/contentlayer'
import { allPoems } from 'contentlayer/generated'
import { InferGetServerSidePropsType } from 'next'
import { GetServerSidePropsContext } from 'next/types'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const poetryAccessToken = process.env.POETRY_ACCESS_TOKEN
  if (poetryAccessToken) {
    const cookie = context.req.cookies?.[POETRY_ACCESS_COOKIE]
    if (cookie !== poetryAccessToken) {
      return {
        redirect: {
          destination: `/poetry/unlock?next=${encodeURIComponent('/poetry')}`,
          permanent: false,
        },
      }
    }
  }

  const poetryPosts = sortedPoemPost(allPoems)

  return {
    props: {
      posts: allCoreContent(poetryPosts),
    },
  }
}

export default function Poetry({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout>
      <PageSEO title={`Poetry - ${siteMetadata.author}`} description="Poems and written pieces" />
      <ListLayout posts={posts} title="Poetry" linkPrefix="/poetry" />
    </MainLayout>
  )
}
