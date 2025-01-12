import { fetchPersons } from '@/app/lib/dataaccess';
import PersonsTable from '@/app/ui/persons-table';

export default async function PeoplePage() {
  const persons = await fetchPersons();

  return (
    <div className="flex flex-col w-full min-h-screen p-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">People</h1>
          {/* TODO: Add "New Person" button here */}
        </div>
        <PersonsTable persons={persons} />
      </div>
    </div>
  );
} 