import Link from 'next/link';

export default function AcknowledgementPage() {
  return (
    <div className='text-center space-y-6 mt-4'>
      <h1 className='text-3xl font-semibold'>
        Thank you for your reservation!
      </h1>
      <Link
        href='/account/bookings'
        className='underline text-xl text-accent-700 inline-block'
      >
        Manage your reservations &rarr;
      </Link>
    </div>
  );
}
