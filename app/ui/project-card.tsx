"use client";
import React from 'react';

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
      <div className="w-[300px]" >
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