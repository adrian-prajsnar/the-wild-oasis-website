'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaPencilAlt } from 'react-icons/fa';
import { format, formatDistance, isPast, isToday, parseISO } from 'date-fns';
import { deleteBooking } from '../_lib/actions';
import { GuestBooking } from '../_types/GuestBooking';
import DeleteBooking from '@/app/_components/DeleteBooking';

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace('about ', '');

type BookingCardProps = {
  booking: GuestBooking;
  onOptimisticDelete?: (bookingId: GuestBooking['id']) => Promise<void>;
};

export default function BookingCard({
  booking,
  onOptimisticDelete,
}: BookingCardProps) {
  const handleDelete = async (bookingId: GuestBooking['id']) =>
    await deleteBooking(bookingId);

  return (
    <div className='flex border border-primary-400 rounded-lg'>
      <div className='relative h-32 aspect-square'>
        <Image
          src={booking.cabins?.image ?? ''}
          alt={`Cabin ${booking.cabins?.name}`}
          fill
          className='object-cover border-r border-primary-400 rounded-l-lg'
        />
      </div>

      <div className='flex-grow px-6 py-3 flex flex-col'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>
            {booking.numNights} nights in Cabin {booking.cabins?.name}
          </h3>
          {isPast(new Date(booking.startDate)) ? (
            <span className='bg-yellow-700 text-primary-50 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-lg'>
              past
            </span>
          ) : (
            <span className='bg-green-700 text-primary-50 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-lg'>
              upcoming
            </span>
          )}
        </div>

        <p className='text-primary-600 font-medium'>
          {format(new Date(booking.startDate), 'EEE, MMM dd yyyy')} (
          {isToday(new Date(booking.startDate))
            ? 'Today'
            : formatDistanceFromNow(booking.startDate)}
          ) &mdash; {format(new Date(booking.endDate), 'EEE, MMM dd yyyy')}
        </p>

        <div className='flex gap-5 mt-auto items-baseline'>
          <p className='text-lg font-semibold text-accent-700'>
            ${booking.totalPrice}
          </p>
          <p className='text-primary-600'>&bull;</p>
          <p className='text-primary-600 font-medium'>
            {booking.numGuests} guest{booking.numGuests > 1 && 's'}
          </p>
          <p className='ml-auto text-sm font-medium text-primary-500'>
            Booked {format(new Date(booking.created_at), 'EEE, MMM dd yyyy, p')}
          </p>
        </div>
      </div>

      <div className='flex flex-col border-l border-primary-400 w-[100px]'>
        {!isPast(booking.startDate) && (
          <>
            <Link
              href={`/account/bookings/update/${booking.id}`}
              className='group flex items-center gap-2 uppercase text-xs font-bold text-primary-600 border-b border-primary-400 flex-grow px-3 rounded-tr-lg hover:bg-accent-700 transition-colors hover:text-primary-50'
            >
              <FaPencilAlt className='h-4 w-4 text-primary-500 group-hover:text-primary-200 transition-colors' />
              <span className='mt-1'>Update</span>
            </Link>
            <DeleteBooking
              bookingId={booking.id}
              onDelete={onOptimisticDelete ?? handleDelete}
            />
          </>
        )}
      </div>
    </div>
  );
}
