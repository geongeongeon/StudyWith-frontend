<template>
  <div class="container p-3 text-center">
    <div>
      <img class="img-fluid" src="/home.jpg" alt="">
    </div>
  </div>
</template>

<script setup>
  import connectionTest from '../api/connection-test'
  import { onMounted } from 'vue';
  import router from '../router';
  import { useAlertStore } from '../stores/alertStore';

  const alertStore = useAlertStore();

  onMounted(async () => {
    try {
      const res = await connectionTest.testConnection()
      console.log(res.data.message)
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }

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