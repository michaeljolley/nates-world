import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useStreaksStore = defineStore('streaks', () => {
  const streaks = ref({}) // { [difficulty]: { current: 0, max: 0 } }
  const loading = ref(false)

  const authStore = useAuthStore()

  async function loadStreaks() {
    if (!authStore.isLoggedIn || !authStore.supabase) {
      streaks.value = {}
      return
    }

    loading.value = true
    try {
      const { data, error } = await authStore.supabase
        .from('tictactoe_streaks')
        .select('difficulty, current_streak, max_streak')
        .eq('user_id', authStore.user.id)

      if (error) throw error

      streaks.value = {}
      for (const row of data || []) {
        streaks.value[row.difficulty] = {
          current: row.current_streak,
          max: row.max_streak
        }
      }
    } catch (error) {
      console.error('Failed to load streaks:', error)
    } finally {
      loading.value = false
    }
  }

  async function recordWin(difficulty) {
    if (!authStore.isLoggedIn || !authStore.supabase) return null

    const userId = authStore.user.id
    const current = (streaks.value[difficulty]?.current || 0) + 1
    const prevMax = streaks.value[difficulty]?.max || 0
    const newMax = Math.max(current, prevMax)

    try {
      const { error } = await authStore.supabase
        .from('tictactoe_streaks')
        .upsert({
          user_id: userId,
          difficulty,
          current_streak: current,
          max_streak: newMax
        }, {
          onConflict: 'user_id,difficulty'
        })

      if (error) throw error

      streaks.value[difficulty] = { current, max: newMax }
      return { current, max: newMax, isNewRecord: current > prevMax }
    } catch (error) {
      console.error('Failed to record win:', error)
      return null
    }
  }

  async function recordLoss(difficulty) {
    if (!authStore.isLoggedIn || !authStore.supabase) return null

    const userId = authStore.user.id
    const prevMax = streaks.value[difficulty]?.max || 0

    try {
      const { error } = await authStore.supabase
        .from('tictactoe_streaks')
        .upsert({
          user_id: userId,
          difficulty,
          current_streak: 0,
          max_streak: prevMax
        }, {
          onConflict: 'user_id,difficulty'
        })

      if (error) throw error

      streaks.value[difficulty] = { current: 0, max: prevMax }
      return { current: 0, max: prevMax }
    } catch (error) {
      console.error('Failed to record loss:', error)
      return null
    }
  }

  function getStreak(difficulty) {
    return streaks.value[difficulty] || { current: 0, max: 0 }
  }

  return {
    streaks,
    loading,
    loadStreaks,
    recordWin,
    recordLoss,
    getStreak
  }
})
