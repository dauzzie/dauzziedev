import Link from 'next/link'

type BlogLink = { slug: string; title: string }

interface PostNavigationProps {
  prev?: BlogLink
  next?: BlogLink
  routePrefix?: '/journal' | '/poetry'
}

export default function PostNavigation({
  prev,
  next,
  routePrefix = '/journal',
}: PostNavigationProps) {
  return (
    <div className="grid grid-rows-2 sm:grid-cols-2 gap-3 pt-4 sm:pt-6">
      <div>
        {prev && (
          <div className="flex flex-col space-y-1 items-center sm:items-start">
            <span className="italic">Previous Entry</span>
            <Link
              href={`${routePrefix}/${prev.slug}`}
              className="underline-magical truncate max-w-sm sm:max-w-[250px] xl:max-w-md"
            >
              &larr; {prev.title}
            </Link>
          </div>
        )}
      </div>
      <div>
        {next && (
          <div className="flex flex-col space-y-1 items-center sm:items-end">
            <span className="italic">Next Entry</span>
            <Link
              href={`${routePrefix}/${next.slug}`}
              className="underline-magical truncate max-w-sm sm:max-w-[250px] xl:max-w-md"
            >
              {next.title} &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
