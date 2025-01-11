'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Project, Person } from '@/app/lib/definitions';
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

export function ProjectDetailsForm({ project }: { project: Project }) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
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

  async function onSubmit(data: any) {
    setIsLoading(true);
    try {
      // TODO: Implement update action
      console.log('Updating project with data:', data);
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="project_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} className="max-w-xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project_scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Scope</FormLabel>
              <FormControl>
                <Textarea {...field} className="max-w-xl h-32" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 max-w-xl">
          <FormField
            control={form.control}
            name="project_start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="project_manager_id"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FormLabel>Project Manager</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project manager" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {persons.map((person) => (
                    <SelectItem key={person.person_id} value={person.person_id}>
                      {person.person_surname}, {person.person_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 