import { Navigate, Outlet } from 'react-router-dom'
import { LoadingState } from '../components/states/AsyncStates'
import { useAuth } from '../auth/useAuth'

export function OnboardingRoute() {
  const { status, onboardingCompleted } = useAuth()
  if (status === 'loading') return <LoadingState />
  return onboardingCompleted ? <Navigate to="/" replace /> : <Outlet />
}

export function AuthEntryRoute() {
  const { status, onboardingCompleted } = useAuth()
  if (status === 'loading') return <LoadingState />
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace />
  return status === 'authenticated' ? <Navigate to="/" replace /> : <Outlet />
}

export function SetupRoute() {
  const { status, user } = useAuth()
  if (status === 'loading') return <LoadingState />
  if (status !== 'authenticated' || !user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function ApplicationRoute() {
  const { status, onboardingCompleted, user } = useAuth()
  if (status === 'loading') return <LoadingState />
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace />
  if (status !== 'authenticated' || !user) return <Navigate to="/login" replace />
  if (!user.profile) return <Navigate to="/setup-profile" replace />
  if (!user.intents.length) return <Navigate to="/setup-intent" replace />
  return <Outlet />
}
