import Image from './Image'
import Link from './Link'
import techStack from '@/data/techStack'
import TechIcon from '@/components/tech-icons'

const Card = ({ title, description, stack, href }) => (
  <div className="p-4 md:w-1/2 md" style={{ maxWidth: '544px' }}>
    <div className="h-full overflow-hidden border-2 border-gray-200 rounded-md border-opacity-60 dark:border-gray-700">
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
        <div className="mb-3 flex-col overflow-x-auto">
          <p className="prose font-bold text-gray-500 max-w-none dark:text-gray-400">
            {stack ? "Stack:" : ""}
          </p>
          <div className="flex space-x-2">
            {
              stack && techStack.map((t) => (
                stack.includes(t.kind) && <TechIcon kind={t.kind} status={10} size="5"/>
              ))
            }
          </div>

        </div>
        <p className="mb-3 prose text-gray-500 max-w-none dark:text-gray-400">{description}</p>
        {href && (
          <Link
            href={href}
            className="text-base font-medium leading-6 text-purple-500 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label={`Link to ${title}`}
          >
            Repo &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
