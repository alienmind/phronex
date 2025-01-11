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
import { formatDateToLocal } from '@/app/lib/miscutils';
import Link from 'next/link';
//import { CreateOrEditAuditForm } from '@/components/CreateOrEditAuditForm';

export function ProjectCard (
  {id, name, scope, startDate, endDate, authorName, authorSurname } : {
   id: string;
   name: string;
   scope: string;
   startDate: string;
   endDate: string;
   authorName?: string;
   authorSurname?: string;
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
              This action cannot be undone. This will permanently delete the selected project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteProject()}>
              <Button variant="destructive">
                Yes, delete it!
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  ;

  function deleteProject() {
    // TODO - emit event
    console.log("Delete project with id: " + id);
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div 
        className="w-[300px] cursor-move" 
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Card className="w-full">
          <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900">
            <CardTitle className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
              {name}
            </CardTitle>
            <CardDescription className="text-emerald-600 dark:text-emerald-400">
              Created on {formatDateToLocal(startDate)}
              {authorName && authorSurname && (
                <div className="mt-1 text-sm">
                  by {authorName} {authorSurname}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4 bg-white dark:bg-gray-950">
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span className="font-medium">{formatDateToLocal(startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>End Date:</span>
                <span className="font-medium">{formatDateToLocal(endDate)}</span>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-200">{scope}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Link href={`/dashboard/projects/${id}`} className="flex-1">
              <Button className="w-full m-2">
                Open
              </Button>
            </Link>
            {deleteDialog}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};