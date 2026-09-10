import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { AppShell } from './components/layout/AppShell'
import { LoadingState } from './components/states/AsyncStates'
import { LanguageProvider } from './i18n/LanguageProvider'

import { HomePage } from './pages/HomePage'
import { JobsPage } from './pages/JobsPage'
import { JobDetailsPage } from './pages/JobDetailsPage'
import { PostJobPage } from './pages/PostJobPage'
import { MyPostedJobsPage } from './pages/MyPostedJobsPage'
import { JobApplicantsPage } from './pages/JobApplicantsPage'
import { MyApplicationsPage } from './pages/MyApplicationsPage'
import { ServicesPage } from './pages/ServicesPage'
import { MyServicesPage } from './pages/MyServicesPage'

import { LoginPage } from './pages/LoginPage'
import { WelcomePage } from './pages/WelcomePage'
import { OnboardingPage } from './pages/OnboardingPage'
import { OtpPage } from './pages/OtpPage'
import { ProfileEditPage } from './pages/ProfileEditPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProfileSetupPage } from './pages/ProfileSetupPage'
import { IntentSetupPage } from './pages/IntentSetupPage'
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
              <Route path="/login" element={<WelcomePage />} />
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
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
                <Route path="/post-job" element={<PostJobPage />} />
                <Route path="/my-jobs" element={<MyPostedJobsPage />} />
                <Route path="/my-jobs/:jobId/applicants" element={<JobApplicantsPage />} />
                <Route path="/my-applications" element={<MyApplicationsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/my-services" element={<MyServicesPage />} />
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
