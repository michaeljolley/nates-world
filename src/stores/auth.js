import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const supabase = ref(null)
  const user = ref(null)
  const initialized = ref(false)

  const isConfigured = computed(() => supabase.value !== null)
  const isLoggedIn = computed(() => user.value !== null)

  const displayName = computed(() => {
    if (!user.value) return 'Guest'
    return user.value.user_metadata?.full_name ||
           user.value.user_metadata?.name ||
           user.value.user_metadata?.preferred_username ||
           user.value.user_metadata?.user_name ||
           user.value.email?.split('@')[0] ||
           'Player'
  })

  const avatarUrl = computed(() => {
    if (!user.value) return null
    const meta = user.value.user_metadata
    return meta?.avatar_url || 
           meta?.picture || 
           meta?.profile_image_url ||
           null
  })

  async function init() {
    if (initialized.value) return

    const url = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!url || !anonKey || url === 'YOUR_SUPABASE_URL') {
      // Supabase not configured - running in guest mode (this is fine)
      initialized.value = true
      return
    }

    try {
      supabase.value = createClient(url, anonKey)

      const { data: { session } } = await supabase.value.auth.getSession()
      user.value = session?.user || null

      supabase.value.auth.onAuthStateChange((event, session) => {
        user.value = session?.user || null
      })

      initialized.value = true
    } catch (error) {
      console.error('Failed to initialize Supabase:', error)
      initialized.value = true
    }
  }

  async function signInWithGoogle() {
    if (!supabase.value) return { error: { message: 'Auth not configured' } }

    return await supabase.value.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  async function signInWithGitHub() {
    if (!supabase.value) return { error: { message: 'Auth not configured' } }

    return await supabase.value.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin }
    })
  }

  async function signInWithTwitch() {
    if (!supabase.value) return { error: { message: 'Auth not configured' } }

    return await supabase.value.auth.signInWithOAuth({
      provider: 'twitch',
      options: { redirectTo: window.location.origin }
    })
  }

  async function signInWithDiscord() {
    if (!supabase.value) return { error: { message: 'Auth not configured' } }

    return await supabase.value.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin }
    })
  }

  async function signOut() {
    if (!supabase.value) return
    await supabase.value.auth.signOut()
  }

  return {
    user,
    supabase,
    isConfigured,
    isLoggedIn,
    displayName,
    avatarUrl,
    initialized,
    init,
    signInWithGoogle,
    signInWithGitHub,
    signInWithTwitch,
    signInWithDiscord,
    signOut
  }
})
