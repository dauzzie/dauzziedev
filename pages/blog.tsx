import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/journal',
      permanent: true,
    },
  }
}

export default function LegacyBlogIndex() {
  return null
}
