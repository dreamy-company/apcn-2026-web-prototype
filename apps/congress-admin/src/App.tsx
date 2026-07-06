import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Overview from './pages/Overview';
import TicketSales from './pages/TicketSales';
import Attendees from './pages/Attendees';
import CheckinLogs from './pages/CheckinLogs';
import Settings from './pages/Settings';

// All admin pages share the sidebar/topbar shell.
export const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      { path: '/', element: <Overview /> },
      { path: '/sales', element: <TicketSales /> },
      { path: '/attendees', element: <Attendees /> },
      { path: '/checkins', element: <CheckinLogs /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
]);
