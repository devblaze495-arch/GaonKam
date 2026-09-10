import { createContext } from 'react'
import type { AuthState, User, UserIntent, UserProfile } from '../types/auth'

export type AuthContextValue = AuthState & {
  markOnboardingComplete: () => Promise<void>
  requestOtp: (phone: string) => Promise<void>
  verifyOtp: (phone: string, otp: string) => Promise<User>
  updateProfile: (profile: UserProfile) => Promise<void>
  updateIntents: (intents: UserIntent[]) => Promise<void>
  logout: () => Promise<void>
  deleteAccount: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
