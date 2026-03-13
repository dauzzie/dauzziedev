import Image from './Image'
import Link from './Link'

interface CardProps {
  title: string
  description: string
  imgSrc: string
  href: string
  tags?: string[]
}

export default function Card({ title, description, imgSrc, href, tags = [] }: CardProps) {
  return (
    <div className="p-2 md:w-1/2 md" style={{ maxWidth: '544px' }}>
      <div className="rave-tile h-full overflow-hidden rounded-2xl border-opacity-60 dark:border-gray-700">
        {href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center lg:h-48 md:h-36"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center lg:h-48 md:h-36"
            width={544}
            height={306}
          />
        )}
        <div className="p-6">
          <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          <p className="prose text-gray-500 max-w-none dark:text-gray-400">{description}</p>
          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary-500/25 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {href && (
            <div className="mt-5">
              <Link href={href} className="apple-button-secondary" aria-label={`Open ${title}`}>
                Open Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
