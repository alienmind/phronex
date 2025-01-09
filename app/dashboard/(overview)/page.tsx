/*
import CardWrapper from '@/app/ui/projects/cardlist';
import RevenueChart from '@/app/ui/projects/revenue-chart';
import LatestInvoices from '@/app/ui/projects/latest-invoices';
import { CardsWrapperSkeleton CardSkeleton } from '@/app/ui/skeletons';
*/

import { roboto } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};
 
export default async function Page() {
  return (
    <>
    <main>
      Dashboard
    </main>
    </>
  );
}

/*
    <div className="float-left flex flex-1 gap-4 p-4 pt-0">
    <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-1 lg:grid-rows-3 gap-8 xl:gap-12">
    <Suspense fallback={<CardsWrapperSkeleton />}>
      <CardsWrapper/>
    </Suspense>
*/