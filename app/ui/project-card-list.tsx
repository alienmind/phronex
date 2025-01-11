import React from 'react';

// FIXME - static data for testing
//import { projects } from '@/app/seed/load-data'
import { fetchMostRecentProjects } from '@/app/lib/data';
import { ProjectCard } from '@/app/ui/project-card';

export async function ProjectCardList() {

  const projects = await fetchMostRecentProjects(20);

  const projectCardList = (
      projects.length > 0
      ?
      projects.map((project: any) => (
        <ProjectCard
          key={project.project_id}
          id={project.project_id}
          name={project.project_name}
          scope={project.project_scope}
          startDate={project.project_start_date}
          endDate={project.project_end_date}
        />
      ))
      : ""
  );
  
  return (
    <div className="float-left flex flex-1 gap-4 p-4 pt-0">
    <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-1 lg:grid-rows-3 gap-8 xl:gap-12">
    {projectCardList}
    </div>
    </div>
  );
}