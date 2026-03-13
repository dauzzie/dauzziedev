import projectsData from '@/data/projectsData'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ProjectsSpotlight() {
  const featuredProjects = projectsData.slice(0, 2)

  return (
    <section className="space-y-6 py-2">
      <motion.div
        className="apple-glass-card apple-glass-sheen p-6 md:p-8"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary-500 uppercase">
              Build Spotlight
            </p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
              Featured projects
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              A quick look at experiments and shipped builds.
            </p>
          </div>
          <Link href="/projects" className="apple-button-primary w-max">
            View all projects
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              className="rave-tile group block rounded-2xl p-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
            >
              <p className="text-xs font-semibold tracking-[0.12em] text-primary-500 uppercase">
                Project
              </p>
              <h4 className="mt-2 text-xl font-semibold text-gray-900 transition group-hover:text-primary-500 dark:text-gray-100">
                {project.title}
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
              <div className="mt-3 flex gap-3">
                <Link href={`/projects/${project.slug}`} className="apple-button-secondary">
                  Case Study
                </Link>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-button-secondary"
                >
                  Demo
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
