import { notFound } from 'next/navigation';
import { eachDayOfInterval } from 'date-fns';
import { supabase } from './supabase';
import { Tables } from '../_types/database.types';
import { BookedDates } from '../_types/BookedDates';
import { NewGuest } from '../_types/NewGuest';
import { GuestBooking } from '../_types/GuestBooking';
import { Country } from '../_types/Country';

/////////////
// GET

export async function getCabin(
  id: Tables<'cabins'>['id']
): Promise<Tables<'cabins'>> {
  const { data, error } = await supabase
    .from('cabins')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from('cabins')
    .select('regularPrice, discount')
    .eq('id', id)
    .single();

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getCabins(): Promise<Tables<'cabins'>[]> {
  const { data, error } = await supabase
    .from('cabins')
    .select('id, name, maxCapacity, regularPrice, discount, image')
    .returns<Tables<'cabins'>[]>()
    .order('name');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data;
}

export async function getGuest(
  email: string
): Promise<Tables<'guests'> | null> {
  const { data } = await supabase
    .from('guests')
    .select('*')
    .eq('email', email)
    .single();

  return data;
}

export async function getBooking(
  bookingId: Tables<'bookings'>['id']
): Promise<Tables<'bookings'>> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not get loaded.');
  }

  return data;
}

export async function getBookings(
  guestId: Tables<'bookings'>['guestId']
): Promise<GuestBooking[]> {
  const { data, error, count } = await supabase
    .from('bookings')
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)'
    )
    .eq('guestId', guestId)
    .order('startDate');

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded.');
  }

  return data;
}

export async function getBookedDatesByCabinId(
  cabinId: Tables<'bookings'>['cabinId']
): Promise<BookedDates> {
  let today: string | Date = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('cabinId', cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  const bookedDates: BookedDates = data
    .map(booking => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings(): Promise<Tables<'settings'>> {
  const { data, error } = await supabase.from('settings').select('*').single();

  if (error) {
    console.error(error);
    throw new Error('Settings could not be loaded.');
  }

  return data;
}

export async function getCountries(): Promise<Country[]> {
  try {
    const res = await fetch(
      'https://restcountries.com/v2/all?fields=name,flag'
    );
    const countries: Country[] = await res.json();
    return countries;
  } catch {
    throw new Error('Could not fetch countries.');
  }
}

/////////////
// CREATE

export async function createGuest(
  newGuest: NewGuest
): Promise<Tables<'guests'>> {
  const { data, error } = await supabase
    .from('guests')
    .insert([newGuest])
    .returns<Tables<'guests'>>();

  if (error) {
    console.error(error);
    throw new Error('Guest could not be created');
  }

  return data;
}

// export async function createBooking(newBooking) {
//   const { data, error } = await supabase
//     .from('bookings')
//     .insert([newBooking])
//     // So that the newly created object gets returned!
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error('Booking could not be created');
//   }

//   return data;
// }

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data

/*
export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from('guests')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Guest could not be updated');
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from('bookings').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  return data;
}
*/
