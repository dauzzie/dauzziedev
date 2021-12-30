import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import techStack from '@/data/techStack'
import Scroller from '@/components/Scroller'
import RouteTitle from '@/components/RouteTitle'

import NewsletterForm from '@/components/NewsletterForm'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

function TechItems({tech}) {
  return (
  <span className="text-xl bg-purple-200 bg-opacity-40 dark:bg-opacity-10 px-3 py-1 text-purple-800 dark:text-purple-300 text-opacity-10 rounded-lg sm:text-2xl sm:leading-10 md:text-4xl md:leading-20">
    {tech}
  </span>
  );
}

export default function Home({ posts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <RouteTitle>
          <h1 className="text-2xl px-3 font-extrabold leading-9 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuschia-500 to-blue-600 sm:text-3xl sm:leading-10 sm:pl-0 md:text-5xl md:pl-3 md:leading-14">
            Hi, my name is Dausi. I build things with <TechItems tech="TypeScript"/>, <TechItems tech="GraphQL"/> and <TechItems tech="Python"/>.
          </h1>
          <p className="text-sm pl-3 leading-7 pt-5 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
          <div className="pl-3 pt-5">
            <Link
            href="/resume"
            className="text-sm font-bold leading-5 px-5 py-1 sm:leading-5 ring-4 ring-purple-500 ring-opacity-50 text-gray-500 dark:text-gray-200 rounded-full bg-purple-500 bg-opacity-50 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300"
            aria-label="resume"
            >
              Resume
            </Link>
          </div>
      </RouteTitle>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">

        <div className="pt-20 pb-20 space-y-2 md:space-y-5">
          <h2 className="text-base text-center font-bold"> 🚧 On the works 🚧 </h2>
          <div>
            <p className="text-center">Nothing in the works yet right now</p>
          </div>
        </div>
        <div className="pt-20 pb-20 space-y-2 md:space-y-5 justify-center">
          <p className='text-base text-center font-bold'>📚 What I am currently learning 📚 </p>
          <p className="text-center"> What I love about programming is how dynamic you can be with it. There's always new tech to learn! </p>
          <Scroller type="current"/>
          <br/>
          <p className='text-base text-center font-bold'> 🧠 What I am trying to master 🧠 </p>
          <p className="text-center"> These are techs that I want to master, used it and loved it! </p>
          <Scroller type="master"/>
          <br/>
          <p className='text-base text-center font-bold'>🧐 What I am curious about 🧐 </p>
          <p className="text-center">These are techs that I am planning to try out. Reach out to me on your thoughts about these techs!</p>
          <Scroller type="curious"/>
          <br/>
        </div>
      </div>

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-sm font-bold leading-5 px-5 py-1 sm:leading-5 ring-4 ring-purple-500 ring-opacity-50 text-gray-500 dark:text-gray-200 rounded-full bg-purple-500 bg-opacity-50 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {/* {siteMetadata.newsletter.provider !== '' && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )} */}
    </>
  )
}
