import { PageSEO } from '@/components/SEO'
import projectsData from '@/data/projectsData'
import siteMetadata from '@/data/siteMetadata'
import MainLayout from '@/layouts/MainLayout'
import Image from '@/components/Image'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'

type ProjectPageProps = {
  projectSlug: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = projectsData.map((project) => ({ params: { slug: project.slug } }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<ProjectPageProps> = async (context) => {
  const slug = context.params?.slug
  if (typeof slug !== 'string') {
    return { notFound: true }
  }
  const project = projectsData.find((item) => item.slug === slug)
  if (!project) {
    return { notFound: true }
  }
  return { props: { projectSlug: slug } }
}

export default function ProjectCaseStudyPage({
  projectSlug,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const project = projectsData.find((item) => item.slug === projectSlug)
  if (!project) return null

  return (
    <MainLayout>
      <PageSEO
        title={`${project.title} - ${siteMetadata.author}`}
        description={project.description}
      />
      <div className="space-y-8 pt-8 pb-10">
        <section className="apple-glass-card apple-glass-sheen p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary-500 uppercase">
            Project Case Study
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl">
            {project.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-primary-500/35 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
              {project.status}
            </span>
            <span className="rounded-full border border-gray-300/60 bg-white/70 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200">
              {project.role}
            </span>
            {project.duration && (
              <span className="rounded-full border border-gray-300/60 bg-white/70 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200">
                {project.duration}
              </span>
            )}
          </div>
          <p className="mt-4 max-w-3xl text-sm text-gray-600 dark:text-gray-300 md:text-base">
            {project.overview}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-button-primary"
            >
              Live Demo
            </a>
            <Link href="/projects" className="apple-button-secondary">
              Back to Projects
            </Link>
          </div>
        </section>

        {project.videoEmbedUrl && (
          <section className="rave-tile rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
              Demo Video
            </h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                width="100%"
                height="420"
                src={project.videoEmbedUrl}
                title={`${project.title} demo video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <article className="apple-glass-card p-5 md:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Problem</h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{project.problem}</p>
          </article>
          <article className="apple-glass-card p-5 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Solution</h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{project.solution}</p>
          </article>
        </section>

        <section className="apple-glass-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 md:text-2xl">
            Screenshots
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {project.screenshots.map((shot) => (
              <figure
                key={`${project.slug}-${shot.src}-${shot.alt}`}
                className="overflow-hidden rounded-2xl"
              >
                <Image
                  alt={shot.alt}
                  src={shot.src}
                  width={1200}
                  height={675}
                  className="w-full object-cover"
                />
                <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {shot.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rave-tile rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Impact</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
              {project.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="apple-glass-card p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Stack</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="apple-glass-card p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Impact Metrics
            </h2>
            <div className="mt-3 grid gap-2">
              {project.impactMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-white/20 bg-white/40 p-3 dark:bg-black/20"
                >
                  <p className="text-[11px] font-semibold tracking-[0.1em] text-primary-500 uppercase">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </article>
          <article className="rave-tile rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Skills Learned
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
              {project.skillsLearned.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </MainLayout>
  )
}
