import { Suspense } from 'react';
import { getCabin, getCabins } from '@/app/_lib/data-service';

import Cabin from '@/app/_components/Cabin';
import ContentLoader from '@/app/_components/ContentLoader';
import Reservation from '@/app/_components/Reservation';

type Props = {
  params: {
    cabinId: number;
  };
};

export async function generateMetadata({ params }: Props) {
  const { name } = await getCabin(params.cabinId);
  return {
    title: `Cabin ${name}`,
  };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  return cabins.map(cabin => ({
    cabinId: String(cabin.id),
  }));
}

export default async function CabinPage({ params }: Props) {
  const cabin = await getCabin(params.cabinId);

  return (
    <div className='max-w-6xl mx-auto mt-8'>
      <Cabin cabin={cabin} />

      <div>
        <h2 className='text-5xl font-semibold text-center mb-10 text-accent-400'>
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<ContentLoader content='reservation' />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
