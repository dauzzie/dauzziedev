import kebabCase from '@/lib/utils/kebabCase'
import Link from 'next/link'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`} className="tag-pill">
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
