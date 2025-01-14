'use client';

import { useState, useEffect, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { Project, Person } from '@/app/lib/dataschemas';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/app/ui/date-picker";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { updateProjectAction } from '@/app/lib/actions';
import Link from 'next/link';

/*
 * This is the project details form (client) component
 * Allows to edit the project details
 */
export function ProjectDetailsForm({ project }: { project: Project }) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast()
  const form = useForm({
    defaultValues: {
      project_id: project.project_id,
      project_name: project.project_name,
      project_scope: project.project_scope || '',
      project_start_date: project.project_start_date ? new Date(project.project_start_date) : new Date(),
      project_end_date: project.project_end_date ? new Date(project.project_end_date) : new Date(),
      project_manager_id: project.project_manager_id,
    }
  });

  useEffect(() => {
    async function fetchPersons() {
      const response = await fetch('/api/persons');
      const data = await response.json();
      setPersons(data);
    }
    fetchPersons();
  }, []);

  const [errorMessage, formAction, isPending] = useActionState(
    updateProjectAction,
    undefined,
  );

  // Effect for error message
  // FIXME - iterate through all errors
  useEffect(() => {
    const error : string|undefined = errorMessage?.error;
    if (!errorMessage) return;
    toast({
      variant: "destructive",
      className: "text-white",
      title: "Error",
      description: error,
      action: (
        <ToastAction altText="Back">Back</ToastAction>
      ),
    })
  }, [errorMessage]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4 sm:space-y-6">
        <FormField
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input className="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FormField
            name="project_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_manager_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Manager</FormLabel>
                <Select 
                  name="project_manager_id"
                  required
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project manager" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {persons.length > 0 ?
                      persons.map((person) => (
                        <SelectItem key={person.person_id} value={person.person_id}>
                          {person.person_surname}, {person.person_name}
                        </SelectItem>
                      )) : "No persons found"}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormField
            name="project_start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="project_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <DatePicker {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="project_scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Scope</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Project scope" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
          <Button variant="outline" type="button" className="w-full sm:w-auto">
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 