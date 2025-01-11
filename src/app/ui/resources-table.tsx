import { ProjectResource, ProjectWithPersonRole } from "../lib/definitions";

export function ProjectResourcesTable({ resources }: { resources: ProjectResource[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Project Resources</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource, index) => (
            <tr key={index}>
              <td>{resource.person_name}</td>
              <td>{resource.role_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 