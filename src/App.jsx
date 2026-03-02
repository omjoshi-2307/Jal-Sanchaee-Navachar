import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/AuthContext";
import { WaterCreditProvider } from "./hooks/WaterCreditContext";
import FloatingChat from "./components/FloatingChat";
import FloatingCredits from "./components/FloatingCredits";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Planner from "./pages/IrrigationPlanner/Planner";
import WaterTable from "./pages/WaterTable/WaterTable";
import Solution from "./pages/Solution/Solution";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import GovernmentSchemes from "./pages/GovernmentSchemes/GovernmentSchemes";
import WaterDashboard from "./components/WaterDashboard";
import Support from "./pages/Support/Support";
import PlaceholderPage from "./pages/PlaceholderPage";
import HistoryLayoutWrapper from "./pages/IrrigationPlanner/History/HistoryLayoutWrapper";
import {
  History,
  Settings as SettingsIcon,
  HelpCircle,
  Zap,
  Sprout,
  Bell,
  Landmark
} from 'lucide-react';

const routes = [
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/credits',
    element: (
      <ProtectedRoute>
        <WaterDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/irrigation',
    element: (
      <ProtectedRoute>
        <Planner />
      </ProtectedRoute>
    )
  },
  {
    path: '/water-table',
    element: (
      <ProtectedRoute>
        <WaterTable />
      </ProtectedRoute>
    )
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <HistoryLayoutWrapper />
      </ProtectedRoute>
    )
  },
  {
    path: '/schemes',
    element: (
      <ProtectedRoute>
        <GovernmentSchemes />
      </ProtectedRoute>
    )
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    )
  },
  {
    path: '/support',
    element: (
      <ProtectedRoute>
        <Support />
      </ProtectedRoute>
    )
  },
  {
    path: '/automation',
    element: (
      <ProtectedRoute>
        <PlaceholderPage
          title="Smart Automation"
          icon={Zap}
          description="Configure automated watering triggers and smart pump integration."
        />
      </ProtectedRoute>
    )
  },
  {
    path: '/solution',
    element: (
      <ProtectedRoute>
        <Solution />
      </ProtectedRoute>
    )
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <PlaceholderPage
          title="Notifications"
          icon={Bell}
          description="View all your alerts and updates in one place."
        />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> }
];

function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  console.log("[JalSanchaee] App component rendering...");

  return (
    <AuthProvider>
      <WaterCreditProvider>
        <Toaster position="top-right" />
        <Routes>
          {routes.map((route) => {
            console.log(`[JalSanchaee] Configuring Route: ${route.path}`);
            return (
              <Route key={route.path} path={route.path} element={route.element} />
            );
          })}
        </Routes>
        {!isAuthPage && (
          <>
            <FloatingCredits />
            <FloatingChat />
          </>
        )}
      </WaterCreditProvider>
    </AuthProvider>
  );
}

export default App;
