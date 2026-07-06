import { useMemo } from 'react';
import { HOTELS, hotelById, type Hotel } from '../data/hotels';
import { useHotel } from './HotelContext';
import { useStore } from './StoreContext';
import type { Booking, Quota } from '../data/mock';

export interface ScopedData {
  hotels: Hotel[]; // one hotel, or all five in 'all' mode
  quotas: Quota[];
  bookings: Booking[];
  isAll: boolean;
}

/** Everything below the switcher reads data through this hotel-scoped view. */
export function useScopedData(): ScopedData {
  const { selected } = useHotel();
  const { quotas, bookings } = useStore();
  return useMemo(() => {
    const isAll = selected === 'all';
    return {
      isAll,
      hotels: isAll ? HOTELS : HOTELS.filter((h) => h.id === selected),
      quotas: isAll ? quotas : quotas.filter((q) => q.hotelId === selected),
      bookings: isAll ? bookings : bookings.filter((b) => b.hotelId === selected),
    };
  }, [selected, quotas, bookings]);
}

export function roomTypeName(hotelId: string, roomTypeId: string): string {
  return hotelById(hotelId)?.roomTypes.find((rt) => rt.id === roomTypeId)?.name ?? roomTypeId;
}

export function hotelName(hotelId: string): string {
  return hotelById(hotelId)?.name ?? hotelId;
}
