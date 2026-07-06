import { createBrowserRouter } from 'react-router-dom';
import SponsorAdminLayout from './components/layout/SponsorAdminLayout';
import Overview from './pages/Overview';
import Doctors from './pages/Doctors';
import Payments from './pages/Payments';

export const router = createBrowserRouter([
  {
    element: <SponsorAdminLayout />,
    children: [
      { path: '/', element: <Overview /> },
      { path: '/doctors', element: <Doctors /> },
      { path: '/payments', element: <Payments /> },
    ],
  },
]);
