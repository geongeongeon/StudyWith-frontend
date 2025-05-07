<template>
  <div class="container d-flex justify-content-center align-items-center bg-light">
    <div class="card p-5 shadow rounded" style="width: 400px">
      <h2 class="logo-text text-center mb-3 fw-bold">Login</h2>
      <p class="text-center text-muted mb-4">소셜 로그인으로 스터디를 시작하세요.</p>

      <button class="btn btn-outline-primary w-100 mb-2" @click="login('google')">Google 로그인</button>
      <button class="btn btn-outline-success w-100 mb-2" @click="login('naver')">Naver 로그인</button>
      <button class="btn btn-outline-warning w-100 mb-2" @click="login('kakao')">Kakao 로그인</button>

      <p class="text-center text-muted mt-4">최초 로그인 시 추가 정보가 필요합니다.</p>
    </div>
  </div>
</template>

<script setup>
const login = (provider) => {
  window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
}
</script>

<style scoped>
</style>