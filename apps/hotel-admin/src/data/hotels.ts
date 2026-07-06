// Partner hotels for APCN 2027 (Bali International Convention Centre, Nusa Dua).
export interface RoomTypeDef {
  id: string;
  name: string;
  rate: number; // USD / night
}

export interface Hotel {
  id: string;
  name: string;
  area: string;
  stars: number;
  distanceKm: number; // to BICC venue
  color: string;      // accent used in charts and switcher
  roomTypes: RoomTypeDef[];
}

export const HOTELS: Hotel[] = [
  {
    id: 'mulia', name: 'The Mulia Nusa Dua', area: 'Nusa Dua', stars: 5, distanceKm: 1.2, color: '#f15a24',
    roomTypes: [
      { id: 'deluxe', name: 'Deluxe Room', rate: 210 },
      { id: 'premier', name: 'Premier Ocean View', rate: 280 },
      { id: 'suite', name: 'Executive Suite', rate: 420 },
    ],
  },
  {
    id: 'grandhyatt', name: 'Grand Hyatt Bali', area: 'Nusa Dua', stars: 5, distanceKm: 2.1, color: '#f7931e',
    roomTypes: [
      { id: 'kingview', name: 'King Garden View', rate: 175 },
      { id: 'clubaccess', name: 'Club Access Room', rate: 240 },
      { id: 'suite', name: 'Grand Suite', rate: 380 },
    ],
  },
  {
    id: 'conrad', name: 'Conrad Bali', area: 'Tanjung Benoa', stars: 5, distanceKm: 4.8, color: '#ff8f4d',
    roomTypes: [
      { id: 'deluxe', name: 'Deluxe Garden', rate: 160 },
      { id: 'oceanfront', name: 'Ocean Front Room', rate: 225 },
    ],
  },
  {
    id: 'padma', name: 'Padma Resort Legian', area: 'Legian', stars: 5, distanceKm: 14.5, color: '#c1440e',
    roomTypes: [
      { id: 'deluxe', name: 'Deluxe Chalet', rate: 145 },
      { id: 'premier', name: 'Premier Room', rate: 190 },
    ],
  },
  {
    id: 'aston', name: 'Aston Denpasar', area: 'Denpasar', stars: 4, distanceKm: 11.3, color: '#171717',
    roomTypes: [
      { id: 'superior', name: 'Superior Room', rate: 85 },
      { id: 'deluxe', name: 'Deluxe Room', rate: 110 },
    ],
  },
];

export const hotelById = (id: string): Hotel | undefined => HOTELS.find((h) => h.id === id);
