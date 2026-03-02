import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  Navigate,
} from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import ProfileSetupModal from './components/ProfileSetupModal';
import LandingPage from './pages/LandingPage';
import BiometricScanPage from './pages/BiometricScanPage';
import DashboardPage from './pages/DashboardPage';

// Root layout component
function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background circuit-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full border-2 border-bio-cyan/40 border-t-bio-cyan animate-spin"
            style={{ boxShadow: '0 0 20px oklch(0.85 0.18 195 / 0.3)' }}
          />
          <p className="font-orbitron text-bio-cyan text-sm tracking-widest animate-pulse">
            INITIALIZING SECURE SESSION...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Outlet />
      <ProfileSetupModal open={showProfileSetup} />
    </Layout>
  );
}

// Index redirect component — sends users directly to face scan or dashboard
function IndexRedirect() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return null;
  }

  if (identity) {
    return <Navigate to="/dashboard" />;
  }

  return <Navigate to="/biometric-scan" />;
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexRedirect,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/landing',
  component: LandingPage,
});

const biometricScanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/biometric-scan',
  component: BiometricScanPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  landingRoute,
  biometricScanRoute,
  dashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
