import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata, { author } from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import techStack from '@/data/techStack'
import Scroller from '@/components/Scroller'
import RouteTitle from '@/components/RouteTitle'
import SpotifyNow from '@/components/SpotifyNow'

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
          <h1 className="text-2xl px-3 font-extrabold leading-9 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuschia-500 to-blue-600 sm:text-3xl sm:leading-10 sm:px-0 md:text-5xl md:px-3 md:leading-14">
            Hi, my name is Dausi. I build things with <TechItems tech="TypeScript"/>, <TechItems tech="GraphQL"/> and <TechItems tech="Python"/>.
          </h1>
          <p className="text-sm px-3 leading-7 pt-5 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
          <div className="px-3 pt-5">
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


        <div className="pt-10 pb-10 px-10 divide-y divide-dotted divide-gray-200 dark:divide-gray-700 space-y-2 md:space-y-5 justify-center">
          <div>
          <div className="pt-2 pb-2">
            <p className='text-sm md:text-base lg:px-40 md:px-40 flex-col'>
              <div className="flex space-x-2">
                <p className="text-purple-500 dark:text-purple-400">📚 group</p>
                <p> - compiling <strong>current</strong>  interests... </p>
              </div>

          </p>
          <p className='text-sm md:text-base lg:px-40 md:px-40 flex-col'>
            <div className="flex space-x-2">
              <p className="text-blue-800 dark:text-blue-500">📚 stack</p>
              <p> - compiled new stuff I want to learn successfully in {Math.floor(Math.random() * 100)} ms</p>
            </div>
          </p>
          </div>
          <Scroller type="current"/>

          </div>
          <div>
          <div className="pt-2 pb-2">
            <p className='text-sm md:text-base lg:px-40 md:px-40 flex-col'>
              <div className="flex space-x-2">
                <p className="text-purple-500 dark:text-purple-400">🧠  group</p>
                <p> - compiling <strong>experienced</strong> stacks... </p>
              </div>

          </p>
          <p className='text-sm md:text-base lg:px-40 md:px-40 flex-col'>
            <div className="flex space-x-2">
              <p className="text-blue-800 dark:text-blue-500">🧠  stack</p>
              <p> - compiled current build in {Math.floor(Math.random() * 100)} ms</p>
            </div>
          </p>
          </div>
          <Scroller type="master"/>
          </div>
          <div>
          <div className="pt-2 pb-2">
            <p className='text-sm md:text-base lg:px-40 md:px-40 flex-col'>
              <div className="flex space-x-2">
                <p className="text-purple-500 dark:text-purple-400">🧐  group</p>
                <p> - compiling potential next adventures... </p>
              </div>

          </p>
          <p className='text-sm md:text-base lg:px-40 md:px-40 flex-col'>
            <div className="flex space-x-2">
              <p className="text-blue-800 dark:text-blue-500">🧐  stack</p>
              <p> - compiled things to venture in the future in {Math.floor(Math.random() * 100)} ms</p>
            </div>
          </p>
          </div>
          <Scroller type="curious"/>

          </div>
        </div>
        <div className="pt-10 pb-10 px-10 space-y-2 md:space-y-5">
          <p className='text-base font-bold'>Login to see what I am listening to!</p>
          <SpotifyNow/>
        </div>
      </div>

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-sm font-bold leading-5 px-5 py-1 sm:leading-5 ring-4 ring-purple-500 ring-opacity-50 text-gray-500 dark:text-gray-200 rounded-full bg-purple-500 bg-opacity-50 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300"
            aria-label="all posts"
          >
            Dausie Posts &rarr;
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
