import Link from 'next/link'
import type { FC } from 'react'

import { routeBuilder, Routes } from '~/lib/route-builder'

import { ProjectIcon } from './ProjectIcon'

export type Project = {
  id: string
  avatar?: string
  name: string
  description?: string
}
export const ProjectList: FC<{ projects: Project[] }> = (props) => {
  return (
    <section key="list" className="text-center">
      <div className="grid min-w-0 grid-cols-2 gap-12 lg:grid-cols-3 xl:grid-cols-4">
        {props.projects.map((project) => {
          return (
            <Link
              href={routeBuilder(Routes.Project, { id: project.id })}
              key={project.id}
              className="group flex shrink-0 grid-cols-[60px_2fr] flex-col items-center gap-4 md:grid"
            >
              <ProjectIcon
                className="size-16 group-hover:shadow-out-sm group-hover:-translate-y-2 md:size-auto"
                avatar={project.avatar}
                name={project.name}
              />
              <span className="flex shrink-0 grow flex-col gap-2 text-left">
                <h4 className="m-0 text-balance p-0 text-center font-medium md:text-left">
                  {project.name}
                </h4>
                <span className="line-clamp-5 text-balance text-center text-sm md:line-clamp-4 md:text-left lg:line-clamp-2">
                  {project.description}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
