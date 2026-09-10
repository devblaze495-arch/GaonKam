import { useEffect, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'
import { AuthContext } from './AuthContext'
import type { AuthContextValue } from './AuthContext'
import type { AuthState } from '../types/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', onboardingCompleted: false, user: null })

  useEffect(() => {
    Promise.all([authService.isOnboardingComplete(), authService.getCurrentUser()]).then(([onboardingCompleted, user]) => {
      setState({ status: user ? 'authenticated' : 'unauthenticated', onboardingCompleted, user })
    })
  }, [])

  const value: AuthContextValue = {
    ...state,
    async markOnboardingComplete() {
      await authService.markOnboardingComplete()
      setState((current) => ({ ...current, onboardingCompleted: true }))
    },
    requestOtp: authService.requestOtp,
    async verifyOtp(phone, otp) {
      const user = await authService.verifyOtp(phone, otp)
      setState((current) => ({ ...current, status: 'authenticated', user }))
      return user
    },
    async updateProfile(profile) {
      if (!state.user) throw new Error('USER_NOT_FOUND')
      const user = await authService.updateProfile(state.user.id, profile)
      setState((current) => ({ ...current, user }))
    },
    async updateIntents(intents) {
      if (!state.user) throw new Error('USER_NOT_FOUND')
      const user = await authService.updateIntents(state.user.id, intents)
      setState((current) => ({ ...current, user }))
    },
    async logout() {
      await authService.logout()
      setState((current) => ({ ...current, status: 'unauthenticated', user: null }))
    },
    async deleteAccount() {
      await authService.deleteAccount()
      setState({ status: 'unauthenticated', onboardingCompleted: false, user: null })
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
