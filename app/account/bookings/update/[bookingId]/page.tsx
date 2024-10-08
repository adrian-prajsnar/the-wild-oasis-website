import { Metadata } from 'next';
import { getBooking, getCabin } from '@/app/_lib/data-service';
import { updateBooking } from '@/app/_lib/actions';
import { Tables } from '@/app/_types/database.types';
import ButtonSubmitForm from '@/app/_components/ButtonSubmitForm';

export const metadata: Metadata = {
  title: 'Update booking',
};

type UpdateBookingPageProps = {
  params: {
    bookingId: string;
  };
};

export default async function UpdateBookingPage({
  params,
}: UpdateBookingPageProps) {
  const bookingId: Tables<'bookings'>['id'] = Number(params.bookingId);
  const { numGuests, observations, cabinId }: Tables<'bookings'> =
    await getBooking(Number(params.bookingId));
  const { maxCapacity }: Tables<'cabins'> = await getCabin(cabinId);

  return (
    <div>
      <h2 className='font-semibold text-xl text-accent-700 mb-7'>
        Update booking #{bookingId}
      </h2>

      <form
        action={updateBooking}
        className='bg-primary-100 py-8 px-12 flex gap-6 flex-col rounded-lg'
      >
        <input type='hidden' name='bookingId' value={bookingId} />

        <div className='space-y-2'>
          <label htmlFor='numGuests' className='font-medium'>
            How many people will be staying?
          </label>
          <select
            name='numGuests'
            id='numGuests'
            defaultValue={numGuests}
            className='px-5 py-[0.96875rem] w-full border border-primary-300 rounded-md'
            required
          >
            <option value='' key=''>
              Choose number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(x => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations' className='font-medium'>
            Is there anything we should be aware of regarding your stay?
          </label>
          <textarea
            name='observations'
            id='observations'
            defaultValue={observations ?? ''}
            className='px-5 py-3 w-full border border-primary-300 rounded-md'
            placeholder='Do you have any pets, allergies, or special requests we should know about?'
          />
        </div>

        <div className='flex justify-end items-center gap-6'>
          <ButtonSubmitForm
            content='Update booking'
            loadingContent='Updating...'
          />
        </div>
      </form>
    </div>
  );
}
