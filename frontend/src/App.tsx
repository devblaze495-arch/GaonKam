import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { AppShell } from './components/layout/AppShell'
import { LoadingState } from './components/states/AsyncStates'
import { LanguageProvider } from './i18n/LanguageProvider'
import { HomePage } from './pages/HomePage'
import { IntentSetupPage } from './pages/IntentSetupPage'
import { LoginPage } from './pages/LoginPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { OtpPage } from './pages/OtpPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProfileEditPage } from './pages/ProfileEditPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProfileSetupPage } from './pages/ProfileSetupPage'
import { SetupCompletePage } from './pages/SetupCompletePage'
import { ApplicationRoute, AuthEntryRoute, OnboardingRoute, SetupRoute } from './routes/RouteGuards'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<OnboardingRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>
            <Route element={<AuthEntryRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/mobile" element={<LoginPage />} />
              <Route path="/login/otp" element={<OtpPage />} />
            </Route>
            <Route element={<SetupRoute />}>
              <Route path="/setup-profile" element={<ProfileSetupPage />} />
              <Route path="/setup-intent" element={<IntentSetupPage />} />
              <Route path="/setup-complete" element={<SetupCompletePage />} />
            </Route>
            <Route element={<ApplicationRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<PlaceholderPage />} />
                <Route path="/services" element={<PlaceholderPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<ProfileEditPage />} />
                <Route path="/profile/skills" element={<ProfileEditPage />} />
                <Route path="/profile/preferences" element={<ProfileEditPage />} />
              </Route>
            </Route>
            <Route path="*" element={<LoadingState />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
