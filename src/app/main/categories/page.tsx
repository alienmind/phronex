import { fetchCategoriesAction } from '@/app/lib/actions';
import CategoriesTable from '@/app/ui/categories-table';

export default async function CategoriesPage() {
  const categories = await fetchCategoriesAction();

  return (
    <div className="flex flex-col w-full min-h-screen p-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Categories</h1>
        </div>
        <CategoriesTable categories={categories.data} />
      </div>
    </div>
  );
} 