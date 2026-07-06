import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './App';
import { StoreProvider } from './state/StoreContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Store wraps the router so every page shares one mutable state + audit trail */}
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>,
);
