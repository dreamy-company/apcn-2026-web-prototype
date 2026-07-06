import { createBrowserRouter } from 'react-router-dom';
import HotelAdminLayout from './components/layout/HotelAdminLayout';
import Overview from './pages/Overview';
import QuotaManagement from './pages/QuotaManagement';
import Verification from './pages/Verification';
import Finance from './pages/Finance';

export const router = createBrowserRouter([
  {
    element: <HotelAdminLayout />,
    children: [
      { path: '/', element: <Overview /> },
      { path: '/quota', element: <QuotaManagement /> },
      { path: '/verify', element: <Verification /> },
      { path: '/finance', element: <Finance /> },
    ],
  },
]);
