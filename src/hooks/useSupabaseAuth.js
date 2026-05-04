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

  const signInWithEmail = async (email, password) => {
    if (!supabase) throw new Error('Supabase is not configured')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // ถ้าเข้าสู่ระบบไม่ผ่านเพราะรหัสผิด หรือยังไม่มีบัญชี
    if (error && error.message.includes('Invalid login credentials')) {
      // ให้ทำการสมัครสมาชิกให้เลย
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (signUpError) throw signUpError
      return { data: signUpData, error: null }
    }

    if (error) throw error
    return { data, error: null }
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
