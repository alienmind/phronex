import { fetchRoles } from '@/app/lib/dataaccess';
import RolesTable from '@/app/ui/roles-table';

export default async function RolesPage() {
  const roles = await fetchRoles();

  return (
    <div className="flex flex-col w-full min-h-screen p-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Roles</h1>
          {/* TODO: Add "New Role" button here */}
        </div>
        <RolesTable roles={roles} />
      </div>
    </div>
  );
} 