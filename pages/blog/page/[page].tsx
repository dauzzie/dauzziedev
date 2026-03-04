import type { GetServerSideProps, GetServerSidePropsContext } from 'next'

type Params = { page: string }

export const getServerSideProps: GetServerSideProps<{}, Params> = async (
  context: GetServerSidePropsContext<Params>
) => {
  const page = context.params?.page || '1'
  return {
    redirect: {
      destination: `/journal/page/${page}`,
      permanent: true,
    },
  }
}

export default function LegacyBlogPagination() {
  return null
}
