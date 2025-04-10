<template>
  <div class="container d-flex justify-content-center align-items-center bg-light">
    <div class="card p-5 shadow rounded" style="width: 400px">
      <h2 class="logo-text text-center mb-3 fw-bold">Login</h2>
      <p class="text-center text-muted mb-4">소셜 로그인으로 스터디를 시작하세요.</p>

      <button class="btn btn-outline-primary w-100 mb-2" @click="loginWithGoogle">Google 로그인</button>
      <button class="btn btn-outline-success w-100 mb-2" @click="loginWithNaver">Naver 로그인</button>
      <button class="btn btn-outline-warning w-100 mb-2" @click="loginWithKakao">Kakao 로그인</button>

      <p class="text-center text-muted mt-4">최초 로그인 시 추가 정보가 필요합니다.</p>

      <router-link to="/signup" class="px-2 fw-bold">회원가입</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>