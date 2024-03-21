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
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {props.projects.map((project) => {
          return (
            <Link
              href={routeBuilder(Routes.Project, { id: project.id })}
              key={project.id}
              className="group grid grid-cols-[1fr_2fr] gap-4"
            >
              <ProjectIcon
                className="group-hover:-translate-y-2 group-hover:shadow-out-sm"
                avatar={project.avatar}
                name={project.name}
              />
              <span className="flex shrink-0 grow flex-col gap-2 text-left">
                <h4 className="font-2xl m-0 p-0 font-medium">{project.name}</h4>
                <span className="line-clamp-5 text-sm md:line-clamp-4 lg:line-clamp-2">
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
