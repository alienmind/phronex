'use client';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useForm, FormProvider } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { createProject, State } from '@/app/lib/actions';
import { CreateProjectFormSchema } from '@/app/lib/schemas';
import { useToast } from "@/hooks/use-toast"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState } from 'react';

import {
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

/**
 * 
 */
export function CreateProjectModal() {
  type CreateProjectForm = z.infer<typeof CreateProjectFormSchema>;
  const form = useForm<CreateProjectForm>({
    defaultValues: {
      "project_id": "",
      "project_name": "",
      "project_start_date": "",
      "project_end_date": "",
    }
  });
  const { toast } = useToast()
  const [errorMessage, formAction, isPending] = useActionState(
    createProject,
    undefined,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full m-2" >New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Please set up a descriptive name for this project. Later you can add more details in the project view.
          </DialogDescription>
        </DialogHeader>
          <Form {...form}>
          <form action={formAction}>
              <div className="grid gap-4 py-4">
              <FormField
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <Input className="hidden" placeholder="Project Id" {...field} />
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 py-4">
              <FormField
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <Input placeholder="Project name" {...field} />
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 py-4">
              <FormField
                name="project_start_date"
                render={({ field }) => (
                  <FormItem>
                    <Input placeholder="Project start date" {...field} />
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 py-4">
              <FormField
                name="project_end_date"
                render={({ field }) => (
                  <FormItem>
                    <Input placeholder="Project end date" {...field} />
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 py-4">
              <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save</Button>
              </DialogClose>
              </DialogFooter>
              </div>
          </form>
          </Form>
      </DialogContent>
      <DialogFooter>
        {errorMessage && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{JSON.stringify(errorMessage)}</p>
          </>
        )}
      </DialogFooter>
    </Dialog>
  );
};