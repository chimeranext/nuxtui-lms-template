import { defineStore } from 'pinia'
import type { StoreDefinition } from 'pinia'
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

export interface UserProfile {
  id: string
  name: string
  email: string
  roles: string[]
}

interface SessionSetup {
  profile: Ref<UserProfile | null>
  isTeacher: ComputedRef<boolean>
  fetchProfile: () => Promise<void>
  clear: () => void
}

function sessionSetup(): SessionSetup {
  const profile: Ref<UserProfile | null> = ref(null)

  const isTeacher: ComputedRef<boolean> = computed(
    () => profile.value?.roles.includes('teacher') === true,
  )

  async function fetchProfile(): Promise<void> {
    profile.value = await $fetch<UserProfile>('/api/v1/users/self')
  }

  function clear(): void {
    profile.value = null
  }

  return { profile, isTeacher, fetchProfile, clear }
}

// Auth.js session hydrates this store (academy: real user; template: demo).
export const useSessionStore: StoreDefinition<
  'session',
  Pick<SessionSetup, 'profile'>,
  Pick<SessionSetup, 'isTeacher'>,
  Pick<SessionSetup, 'fetchProfile' | 'clear'>
> = defineStore('session', sessionSetup)
