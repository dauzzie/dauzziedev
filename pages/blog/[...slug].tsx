import { allPoems } from 'contentlayer/generated'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'

type Params = { slug: string[] }

export const getServerSideProps: GetServerSideProps<Record<string, never>, Params> = async (
  context: GetServerSidePropsContext<Params>
) => {
  const slug = Array.isArray(context.params?.slug) ? context.params?.slug.join('/') : ''
  if (!slug) {
    return { notFound: true }
  }

  const isPoem = allPoems.some((poem) => poem.slug === slug)

  return {
    redirect: {
      destination: isPoem ? `/poetry/${slug}` : `/journal/${slug}`,
      permanent: true,
    },
  }
}

export default function LegacyBlogPost() {
  return null
}
