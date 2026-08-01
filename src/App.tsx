import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { TripProvider } from './context/TripContext'
import ProtectedRoute, {
  GuestRoute,
  OnboardingRoute,
} from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import AddTripPage from './pages/AddTripPage'
import TripsPage from './pages/TripsPage'
import SchedulePage from './pages/SchedulePage'
import AnalyticsPage from './pages/AnalyticsPage'
import AssistantPage from './pages/AssistantPage'
import { AboutPage, HelpPage, SettingsPage } from './pages/InfoPages'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TripProvider>
          <Routes>
            {/* Public / guest-only routes */}
            <Route
              path="/"
              element={
                <GuestRoute>
                  <LandingPage />
                </GuestRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <GuestRoute>
                  <SignUpPage />
                </GuestRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />

            {/* Onboarding — only accessible after signup, before completing onboarding */}
            <Route
              path="/onboarding"
              element={
                <OnboardingRoute>
                  <OnboardingPage />
                </OnboardingRoute>
              }
            />

            {/* Protected routes — require auth + completed onboarding */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-trip"
              element={
                <ProtectedRoute>
                  <AddTripPage />
                </ProtectedRoute>
              }
            />
            <Route path="/trips" element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />

            {/* Catch-all — redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TripProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
