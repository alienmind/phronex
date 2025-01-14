/*
 * This is the project card list (client) component
 * It is used to display a list of projects in a grid layout
 * ordered by creation date
 * 
 * It also allows to filter the number of projects to be displayed
 * It is based on the shadcn/ui library
 */
"use client";

import React, { useState } from 'react';
import { ProjectCard } from '@/app/ui/project-card';
import { ProjectListFilter } from '@/app/ui/project-list-filter';
import { Input } from '@/components/ui/input';
import { fetchProjectsAction } from '@/app/lib/actions';
import { VProjectCard } from '@/app/lib/dataschemas';

export function ProjectCardList({ initialProjects, limit = 6 }: { 
  initialProjects: VProjectCard[],
  limit?: number 
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [currentLimit, setCurrentLimit] = useState(limit);

  const handleLimitChange = async (newLimit: number | undefined) => {
    const result = await fetchProjectsAction(newLimit || 0);
    if (result?.success && result?.data) {
      setProjects(result.data);
      setCurrentLimit(newLimit || 0);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-4 gap-4">
        <div className="w-full sm:w-2/3">
          <Input type="text" placeholder="Search projects" />
        </div>
        <div className="w-full sm:w-1/4 flex justify-end">
          <ProjectListFilter defaultValue={currentLimit} onLimitChange={handleLimitChange} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {projects.length > 0
          ? projects.map((project) => (
              <ProjectCard
                key={project.project_id}
                project={project}
              />
            ))
          : ""}
      </div>
    </div>
  );
}