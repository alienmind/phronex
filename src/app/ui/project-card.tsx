/*
 * This is the project card (client) component
 * It is based on the shadcn/ui library
 * It displays an individual project card
 */
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
import { formatDateToLocal, formatCurrency } from '@/app/lib/miscutils';
import Link from 'next/link';
import { Project, VProjectCard } from '../lib/dataschemas';

/*
 * This is the project card (client) component
 * Contains all the summarized info about a project
 */ 
interface ProjectCardProps {
  project: VProjectCard;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Calculate percentage of budget spent
  const percentSpent = project.total_budget ? (project.total_spent / project.total_budget) * 100 : 0;
  const spentColor = percentSpent > 100 ? 'text-destructive' : 'text-muted-foreground';

  // Get background color based on spent ratio (matching project chart colors)
  const getBackgroundColor = (spent: number, budget: number) => {
    const ratio = ((budget?budget>0:false) ? spent / budget : 0);
    if (ratio <= 0.3) return 'bg-[hsl(142_76%_36%/0.15)]';  // Vibrant green
    if (ratio <= 0.7) return 'bg-[hsl(35_92%_65%/0.15)]';   // Vibrant orange
    return 'bg-[hsl(0_85%_60%/0.15)]';                      // Vibrant red
  };

  return (
    <Card 
      className={`
        ${getBackgroundColor(project.total_spent, project.total_budget)} 
        transition-colors 
        hover:bg-muted/60 hover:shadow-md
      `}
    >
      <Link href={`/main/projects/${project.project_id}`}>
        <CardHeader>
          <CardTitle>{project.project_name}</CardTitle>
          <CardDescription>{project.project_scope}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid grid-cols-2 text-sm">
            <span className="text-muted-foreground font-bold">Start Date:</span>
            <span>{project.project_start_date ? formatDateToLocal(project.project_start_date.toString()) : 'Not set'}</span>
            <span className="text-muted-foreground font-bold">End Date:</span>
            <span>{project.project_end_date ? formatDateToLocal(project.project_end_date.toString()) : 'Not set'}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 text-sm">
            <span className="text-muted-foreground font-bold">Total Budget:</span>
            <span>{formatCurrency(project.total_budget)}</span>
            <span className="text-muted-foreground font-bold">Total Spent:</span>
            <span className={spentColor}>{formatCurrency(project.total_spent)}</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${percentSpent > 100 ? 'bg-destructive' : 'bg-primary'}`}
                style={{ width: `${Math.min(percentSpent, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
