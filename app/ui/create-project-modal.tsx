'use client';

import { useState } from "react"
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
  FormLabel,
  FormControl
} from "@/components/ui/form"
import { Calendar as CalendarIcon } from "lucide-react"

import { useForm, FormProvider } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { createProject, State } from '@/app/lib/actions';
import { CreateProjectFormSchema } from '@/app/lib/schemas';
import { useToast } from "@/hooks/use-toast"
import { z } from 'zod';
import { useActionState, useEffect } from 'react';
import { ToastAction } from "@/components/ui/toast"
import { DatePicker } from "@/app/ui/date-picker";

// FIXME - quitar
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


/**
 * 
 */
export function CreateProjectModal() {
  type CreateProjectForm = z.infer<typeof CreateProjectFormSchema>;
  const form = useForm<CreateProjectForm>({
    defaultValues: {
      "project_id": "",
      "project_name": "",
      "project_start_date": new Date(),
      "project_end_date": new Date()
    }
  });
  const { toast } = useToast()
  const [errorMessage, formAction, isPending] = useActionState(
    createProject,
    undefined,
  );

  // Effect for error message
  useEffect(() => {
    const error : string|undefined = errorMessage?.message;
    if (!errorMessage) return;
    toast({
      title: "Error",
      description: error,
      action: (
        <ToastAction altText="Back">Back</ToastAction>
      ),
    })
  }, [errorMessage]);

  return (
    <>
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
          <form action={formAction} >
          {/*
          onSubmit={form.handleSubmit(async (data) => {
                  toast({
                    title: "You submitted the following values:",
                    description: (
                      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                      </pre>
                    )
                  })})}>
          */}
              <div className="grid gap-4 py-4">
              <FormField
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <Input className="hidden" placeholder="Project Id" {...field} />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 py-4">
              <FormField
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <Input placeholder="Project name" {...field} />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 py-4">
              <FormField
                name="project_start_date"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                    <DatePicker {...field} />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-4 py-4">
              <FormField
                name="project_end_date"
                render={({ field }) => (
                  <FormItem>
                    <DatePicker {...field} />
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
    </Dialog>
    </>
  );
};