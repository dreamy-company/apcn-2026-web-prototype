import { createBrowserRouter, ScrollRestoration, Outlet } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { OrderProvider } from './context/OrderContext';

import SplashScreen from './screens/auth/Splash';
import SignUpScreen from './screens/auth/SignUp';
import LoginScreen from './screens/auth/Login';
import OtpScreen from './screens/auth/Otp';
import ForgotScreen from './screens/auth/Forgot';
import PersonalInfoScreen from './screens/auth/PersonalInfo';
import RoleScreen from './screens/auth/Role';
import AuthSuccessScreen from './screens/auth/AuthSuccess';

import DashboardScreen from './screens/home/Dashboard';

import ProgramListScreen from './screens/program/ProgramList';
import ProgramDetailScreen from './screens/program/ProgramDetail';
import ProgramQAScreen from './screens/program/ProgramQA';

import SpeakerListScreen from './screens/speakers/SpeakerList';
import SpeakerDetailScreen from './screens/speakers/SpeakerDetail';

import TicketSelectionScreen from './screens/tickets/TicketSelection';
import OrderSummaryScreen from './screens/tickets/OrderSummary';
import PaymentMethodScreen from './screens/tickets/PaymentMethod';
import CardDetailsScreen from './screens/tickets/CardDetails';
import PaymentReceiptScreen from './screens/tickets/PaymentReceipt';

import EPosterListScreen from './screens/eposter/EPosterList';
import EPosterDetailScreen from './screens/eposter/EPosterDetail';
import SubmissionFormScreen from './screens/eposter/SubmissionForm';
import SubmissionSuccessScreen from './screens/eposter/SubmissionSuccess';

import CheckInSuccessScreen from './screens/checkin/CheckInSuccess';
import CheckInHistoryScreen from './screens/checkin/CheckInHistory';

import NotificationsScreen from './screens/notifications/Notifications';

import ProfileScreen from './screens/profile/Profile';
import EditProfileScreen from './screens/profile/EditProfile';
import MyTicketsScreen from './screens/profile/MyTickets';
import TicketDetailQRScreen from './screens/profile/TicketDetailQR';
import SettingsScreen from './screens/profile/Settings';

function Root() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      // Auth & onboarding (no shell)
      { path: '/', element: <SplashScreen /> },
      { path: '/signup', element: <SignUpScreen /> },
      { path: '/login', element: <LoginScreen /> },
      { path: '/otp', element: <OtpScreen /> },
      { path: '/forgot', element: <ForgotScreen /> },
      { path: '/onboarding/personal', element: <PersonalInfoScreen /> },
      { path: '/onboarding/role', element: <RoleScreen /> },
      { path: '/welcome', element: <AuthSuccessScreen /> },

      // Main app (responsive shell: bottom tabs on mobile, sidebar on desktop)
      {
        element: <AppShell />,
        children: [
          { path: '/dashboard', element: <DashboardScreen /> },
          { path: '/program', element: <ProgramListScreen /> },
          { path: '/program/:id', element: <ProgramDetailScreen /> },
          { path: '/program/:id/qa', element: <ProgramQAScreen /> },
          { path: '/speakers', element: <SpeakerListScreen /> },
          { path: '/speakers/:id', element: <SpeakerDetailScreen /> },
          { path: '/eposter', element: <EPosterListScreen /> },
          { path: '/eposter/:id', element: <EPosterDetailScreen /> },
          { path: '/notifications', element: <NotificationsScreen /> },
          { path: '/checkin', element: <CheckInSuccessScreen /> },
          { path: '/checkin/history', element: <CheckInHistoryScreen /> },
          { path: '/profile', element: <ProfileScreen /> },
          { path: '/profile/edit', element: <EditProfileScreen /> },
          { path: '/profile/tickets', element: <MyTicketsScreen /> },
          { path: '/profile/tickets/:id', element: <TicketDetailQRScreen /> },
          { path: '/settings', element: <SettingsScreen /> },
        ],
      },

      // Ticket purchase flow (focused, shares order state)
      {
        element: (
          <OrderProvider>
            <Outlet />
          </OrderProvider>
        ),
        children: [
          { path: '/tickets', element: <TicketSelectionScreen /> },
          { path: '/tickets/summary', element: <OrderSummaryScreen /> },
          { path: '/tickets/payment', element: <PaymentMethodScreen /> },
          { path: '/tickets/card', element: <CardDetailsScreen /> },
          { path: '/tickets/receipt', element: <PaymentReceiptScreen /> },
        ],
      },

      // E-poster submission flow (focused)
      { path: '/eposter/:id/submit', element: <SubmissionFormScreen /> },
      { path: '/eposter/submitted', element: <SubmissionSuccessScreen /> },
    ],
  },
]);
