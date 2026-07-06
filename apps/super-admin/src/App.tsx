import { createBrowserRouter } from 'react-router-dom';
import SuperAdminLayout from './components/layout/SuperAdminLayout';
import CommandCenter from './pages/CommandCenter';
import TicketControl from './pages/TicketControl';
import HotelQuotas from './pages/HotelQuotas';
import SponsorAllocations from './pages/SponsorAllocations';
import AccessControl from './pages/AccessControl';
import Ledger from './pages/Ledger';

// All super-admin pages share the sidebar/topbar shell.
export const router = createBrowserRouter([
  {
    element: <SuperAdminLayout />,
    children: [
      { path: '/', element: <CommandCenter /> },
      { path: '/tickets', element: <TicketControl /> },
      { path: '/hotels', element: <HotelQuotas /> },
      { path: '/sponsors', element: <SponsorAllocations /> },
      { path: '/access', element: <AccessControl /> },
      { path: '/ledger', element: <Ledger /> },
    ],
  },
]);
