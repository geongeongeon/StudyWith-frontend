<template>
  <div class="container p-3 text-center">
    <button class="btn btn-dark mx-auto mb-3" @click="callConnectionTest">백앤드 연결 테스트</button>
    <div>
      <img class="img-fluid" src="/home.jpg" alt="">
    </div>
  </div>
</template>

<script setup>
  import connectionTest from '../api/connection-test'
  import { onMounted } from 'vue';
  import router from '../router';

  const callConnectionTest = async () => {
    try {
      const res = await connectionTest.testConnection()
      alert(res.data.message)
    } catch (err) {
      alert(err.response.data.message)
    }
  }

  onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status === '200') {
      sessionStorage.setItem('isLoggedIn', 'true');
      router.replace('/')
    }
  });
</script>

<style scoped>
</style>