<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import SignInModal from '@/components/SignInModal.vue'

const auth = useAuthStore()
const showModal = ref(false)

function openModal() {
  if (auth.isConfigured) {
    showModal.value = true
  } else {
    alert('Authentication is not configured yet. Please set up Supabase credentials.')
  }
}

async function handleSignOut() {
  await auth.signOut()
}
</script>

<template>
  <div class="auth-container">
    <!-- Logged in state -->
    <div v-if="auth.isLoggedIn" class="auth-user">
      <span class="avatar">
        <img v-if="auth.avatarUrl" :src="auth.avatarUrl" alt="Avatar" />
        <span v-else>👤</span>
      </span>
      <span class="username">{{ auth.displayName }}</span>
      <button class="btn btn-signout" @click="handleSignOut">Sign Out</button>
    </div>

    <!-- Guest state -->
    <div v-else class="auth-guest">
      <span class="guest-label">Playing as Guest</span>
      <button class="btn btn-signin" @click="openModal">Sign In</button>
    </div>

    <SignInModal :show="showModal" @close="showModal = false" />
  </div>
</template>

<style scoped>
.auth-container {
  font-family: 'Segoe UI', Arial, sans-serif;
}

.auth-user,
.auth-guest {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(26, 26, 26, 0.95);
  padding: 8px 15px;
  border-radius: 25px;
  border: 1px solid rgba(0, 200, 83, 0.3);
}

[data-theme="light"] .auth-user,
[data-theme="light"] .auth-guest {
  background: rgba(255, 255, 255, 0.95);
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.avatar img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  color: #00c853;
  font-weight: 600;
  font-size: 0.9rem;
}

.guest-label {
  color: #888;
  font-size: 0.85rem;
}

.btn {
  background: linear-gradient(135deg, #00c853 0%, #00e676 100%);
  color: #000;
  border: none;
  padding: 6px 16px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  background: linear-gradient(135deg, #ff6600 0%, #ff8533 100%);
  color: #fff;
  transform: scale(1.05);
}

.btn-signout {
  background: rgba(255, 255, 255, 0.1);
  color: #aaa;
}

.btn-signout:hover {
  background: #ff4444;
  color: #fff;
}

@media (max-width: 600px) {
  .auth-container {
    top: 10px;
    right: 10px;
  }

  .guest-label {
    display: none;
  }
}
</style>
