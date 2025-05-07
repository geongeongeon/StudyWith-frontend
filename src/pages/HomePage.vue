<template>
  <div class="container">
    <h3>홈 페이지</h3>
    <button class="btn btn-primary" @click="callConnectionTest">백앤드 연결 테스트</button>
    <button class="btn btn-primary" @click="callLogout">로그아웃 요청</button>
  </div>
</template>

<script setup>
import authService from '../api/auth-service'
import connectionTest from '../api/connection-test'
import { useAuthStore } from '../stores/authStore'

const callConnectionTest = async () => {
  try {
    const res = await connectionTest.testConnection()
    alert(res.data.message)
  } catch (err) {
    alert(err.response.data.message)
  }
}

const callLogout = async () => {
  try {
    const res = await authService.logout()
    
    if (res.data.code == 200) {
      const authStore = useAuthStore()
      authStore.clear()
    }

    alert(res.data.message)
  } catch (err) {
    alert(err.response.data.message)
  }
}
</script>

<style scoped>
</style>