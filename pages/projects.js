import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { PageSEO } from '@/components/SEO'
import RouteTitle from '@/components/RouteTitle'

export default function Projects() {
  return (
    <>
      <PageSEO title={`Projects - ${siteMetadata.author}`} description={siteMetadata.description} />
      <RouteTitle>
          <div className="space-y-2 md:space-y-5">
            <h1 className="text-center text-2xl font-extrabold leading-9 bg-clip-tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-5xl md:leading-14">
              Projects
            </h1>
            <p className="text-center text-base leading-7 text-gray-500 dark:text-gray-400">
              <strong>(</strong> projects : "unfinished" , life : "unfinished" <strong>)</strong>
            </p>
          </div>
        </RouteTitle>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">

        <div className="flex py-12">
          <div className="flex flex-wrap -m-4">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                stack={d.stack}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
