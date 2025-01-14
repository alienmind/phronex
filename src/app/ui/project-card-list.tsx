/*
 * This is the project card list (client) component
 * It is used to display a list of projects in a grid layout
 * ordered by creation date
 * 
 * It also allows to filter the number of projects to be displayed and to search for a project with free text
 * It is based on the shadcn/ui library
 */
"use client";

import React, { useState } from 'react';
import { ProjectCard } from '@/app/ui/project-card';
import { ProjectListFilter } from '@/app/ui/project-list-filter';
import { Input } from '@/components/ui/input';
import { fetchProjectsAction } from '@/app/lib/actions';
import { VProjectCard } from '@/app/lib/dataschemas';
import { CreateProjectModal } from './create-project-modal';

export function ProjectCardList({ initialProjects, limit = 6 }: { 
  initialProjects: VProjectCard[],
  limit?: number 
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    const result = await fetchProjectsAction(limit || 0, value);
    if (result?.success && result?.data) {
      setProjects(result.data);
    }
  };

  const handleLimitChange = async (newLimit: number | undefined) => {
    const result = await fetchProjectsAction(newLimit || 0, searchTerm);
    if (result?.success && result?.data) {
      setProjects(result.data);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-4 gap-4">
        <CreateProjectModal/>
        <div className="w-full sm:w-2/3">
          <Input 
            type="text" 
            placeholder="Search projects" 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/4 flex justify-end">
          <ProjectListFilter onLimitChange={handleLimitChange} />
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