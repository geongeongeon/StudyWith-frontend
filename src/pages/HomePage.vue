<template>
  <div class="container">
    <h3>홈 페이지</h3>
    <button class="btn btn-primary" @click="callConnectionTest">백앤드 연결 테스트</button>
  </div>
</template>

<script setup>
import connectionTest from '../api/connection-test'

const callConnectionTest = async () => {
  try {
    const res = await connectionTest.testConnection()
    console.log('응답:', res)
    alert(res.data)
  } catch (err) {
    console.error('응답:', err)
    alert('Failed to connect to backend.')
  }
}
</script>

<style scoped>
</style>