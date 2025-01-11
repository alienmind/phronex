'use client';

import React, { useEffect, useState } from 'react';
import { ProjectCard } from '@/app/ui/project-card';
import { ProjectListFilter } from '@/app/ui/project-list-filter';

export function ProjectCardList({ initialProjects, limit = 6 }: { 
  initialProjects: any[],
  limit?: number 
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [currentLimit, setCurrentLimit] = useState(limit);

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch(`/api/projects?limit=${currentLimit}`);
      const data = await response.json();
      setProjects(data);
    }

    fetchProjects();
  }, [currentLimit]);

  const handleLimitChange = (newLimit: number | undefined) => {
    setCurrentLimit(newLimit || 0);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-end mb-6 px-4">
        <ProjectListFilter defaultValue={currentLimit} onLimitChange={handleLimitChange} />
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