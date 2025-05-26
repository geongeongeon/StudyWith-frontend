<template>
  <header class="container text-center mb-3">
    <nav class="navbar mt-1 ">
      <ul class="navbar-nav d-flex justify-content-end flex-row w-100 px-3">
        <li class="nav-item d-flex align-items-center justify-content-center" v-if="authStore.isAuthenticated">
          <div class="d-flex align-items-center" style="height: 40px;">
            <img :src="`http://localhost:8080${authStore.profileImage}`" class="border" style="width: 35px; height: 35px; object-fit: cover;" />
            <p class="mb-0 ms-2" v-text=authStore.nickname></p>
          </div>
        </li>
        <li class="nav-item" v-if="authStore.isAuthenticated">
          <button class="nav-link mx-2 py-0 message-box-btn">
            <i class="bi bi-envelope-fill d-inline-flex px-0 message-box"></i>
          </button>
        </li>

        <!-- 구분선 -->
        <li class="nav-item d-flex align-items-center px-2" v-if="authStore.isAuthenticated">
          <div style="width: 2px; height: 20px; background-color: #ccc;"></div>
        </li>

        <li class="nav-item" v-if="authStore.isAuthenticated">
          <button class="nav-link px-2 fw-bold" @click="logout">LOGOUT</button>
        </li>

        <li class="nav-item" v-else>
          <router-link to="/login" class="nav-link px-2 fw-bold">LOGIN</router-link>
        </li>
      </ul>
    </nav>

    <p class="logo-text fw-bold fs-1 py-5">Study With.</p>

    <nav class="navbar">
      <ul class="navbar-nav d-flex flex-row w-100 px-3 gap-3">
        <li class="nav-item">
          <router-link to="/" class="nav-link px-2 fw-bold">HOME</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/study" class="nav-link px-2 fw-bold">STUDY</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/my" class="nav-link px-2 fw-bold">MYPAGE</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import authService from '../api/auth-service';
import { useAlertStore } from '../stores/alertStore';
import { useAuthStore } from '../stores/authStore';

const alertStore = useAlertStore()
const authStore = useAuthStore()
const isHover = ref(false)

const logout = async () => {
  try {
    const res = await authService.logout()
    
    if (res.data.code == 200) {
      authStore.clear()
      sessionStorage.removeItem('isLoggedIn')
      window.location.reload()
    }
  } catch (err) {
    alertStore.showAlert(err.response.data.message)
  }
}
</script>

<style scoped>
  .message-box-btn {
    position: relative;
    top: 12px;
    line-height: 0;
  }

  .message-box {
    color: #707b86;
    font-size: 1.2rem; 
    transition: color 0.4s ease;
  }

  .message-box:hover {
    color: #444444;
  }
</style>