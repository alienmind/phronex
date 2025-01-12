/*
 * This is the project card list (client) component
 * It is used to display a list of projects in a grid layout
 * ordered by creation date
 * 
 * It also allows to filter the number of projects to be displayed
 * It is based on the shadcn/ui library
 */
"use client";

import React, { useEffect, useState } from 'react';
import { ProjectCard } from '@/app/ui/project-card';
import { ProjectListFilter } from '@/app/ui/project-list-filter';
import { Input } from '@/components/ui/input';

export function ProjectCardList({ initialProjects, limit = 6 }: { 
  initialProjects: any[],
  limit?: number 
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [currentLimit, setCurrentLimit] = useState(limit);

  // Fetch projects from the server
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

  // For each project, display a ProjectCard component
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-6 px-4 gap-4">
        <div className="w-2/3">
          <Input type="text" placeholder="Search projects" />
        </div>
        <div className="w-1/4 flex justify-end">
          <ProjectListFilter defaultValue={currentLimit} onLimitChange={handleLimitChange} />
        </div>
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