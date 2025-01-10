import React from 'react';

// FIXME - static data for testing
import { projects } from '@/app/lib/load-data'


export async function ProjectCardList() {

  // FIXME - static data and simulate a slow load
  await new Promise(resolve => setTimeout(resolve, 3000));
  
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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
//import { CreateOrEditAuditForm } from '@/components/CreateOrEditAuditForm';

export function ProjectCard (
  {id, name, scope, startDate, endDate } : {
   id: string;
   name: string;
   scope: string;
   startDate: string;
   endDate: string;
  }) {

  const deleteDialog = 
      <AlertDialog>
        <AlertDialogTrigger asChild>
        <Button className="w-full m-2" variant="destructive">
          Delete
        </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected audit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteProject()}>
              Yes, delete it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  ;

  function deleteProject() {
    // TODO - emit event
    console.log("Delete project with id: " + id);
  }

  return (
    <>
      <div className="w-[350px]" >
        <Card>
          <CardHeader>
            <input type="hidden" name="project_id" value={id} />
            <CardTitle>{name}</CardTitle>
            <CardDescription>{name}</CardDescription>
          </CardHeader>
          <CardContent>
          {scope}
          </CardContent>
          <CardFooter>
            {deleteDialog}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};