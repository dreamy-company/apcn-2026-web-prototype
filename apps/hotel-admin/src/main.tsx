import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './App';
import { HotelProvider } from './state/HotelContext';
import { StoreProvider } from './state/StoreContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Store (bookings/quotas + live sync) and hotel selection wrap the whole app. */}
    <StoreProvider>
      <HotelProvider>
        <RouterProvider router={router} />
      </HotelProvider>
    </StoreProvider>
  </StrictMode>,
);
