import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export function useSupabaseAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session ?? null)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession ?? null)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signInWithEmail = async (email) => {
    if (!supabase) throw new Error('Supabase is not configured')

    const redirectBase = import.meta.env.VITE_SUPABASE_REDIRECT_URL?.trim()
    const emailRedirectTo = redirectBase
      ? new URL(redirectBase).toString()
      : new URL('/', window.location.origin).toString()

    return supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo,
      },
    })
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return {
    session,
    user,
    loading,
    isConfigured: isSupabaseConfigured,
    signInWithEmail,
    signOut,
  }
}
