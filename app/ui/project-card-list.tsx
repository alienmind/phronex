import React from 'react';
import { fetchMostRecentProjects } from '@/app/lib/data';
import { ProjectCard } from '@/app/ui/project-card';
import { ProjectListFilter } from '@/app/ui/project-list-filter';

export async function ProjectCardList({ limit = 6 }: { limit?: number }) {
  const projects = await fetchMostRecentProjects(limit);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-end mb-6 px-4">
        <ProjectListFilter defaultValue={limit} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-1 lg:grid-rows-3 gap-8 xl:gap-12">
        {projects.length > 0
          ? projects.map((project: any) => (
              <ProjectCard
                key={project.project_id}
                id={project.project_id}
                name={project.project_name}
                scope={project.project_scope}
                startDate={project.project_start_date}
                endDate={project.project_end_date}
                authorName={project.person_name}
                authorSurname={project.person_surname}
              />
            ))
          : ""}
      </div>
    </div>
  );
}