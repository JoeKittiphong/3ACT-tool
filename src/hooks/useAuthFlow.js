import { useState } from 'react'
import { authText } from '../constants/authText'

export function useAuthFlow({ signInWithEmail, resetPassword }) {
  const [authMessage, setAuthMessage] = useState('')
  const [authError, setAuthError] = useState('')

  const clearAuthFeedback = () => {
    setAuthMessage('')
    setAuthError('')
  }

  const handleEmailSignIn = async (email, password) => {
    clearAuthFeedback()

    try {
      const { error } = await signInWithEmail(email, password)
      if (error) throw error
    } catch (error) {
      console.error('Auth failed', error)
      setAuthError(error.message || authText.signInErrorFallback)
    }
  }

  const handleResetPassword = async (email) => {
    clearAuthFeedback()

    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      setAuthMessage(authText.resetPasswordSuccess)
    } catch (error) {
      console.error('Password reset failed', error)
      setAuthError(error.message || authText.resetPasswordErrorFallback)
    }
  }

  return {
    authMessage,
    authError,
    clearAuthFeedback,
    handleEmailSignIn,
    handleResetPassword,
  }
}

