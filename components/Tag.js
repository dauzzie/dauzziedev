import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <a className="mr-3 text-xs font-medium lowercase text-purple-500 hover:text-purple-600 dark:hover:text-purple-400">
        {text.split(' ').join('-')}
      </a>
    </Link>
  )
}

export default Tag
