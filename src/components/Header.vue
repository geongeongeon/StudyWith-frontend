<template>
  <header class="container text-center mb-3">
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
        <li class="nav-item ms-auto">
          <router-link to="/login" class="nav-link px-2 fw-bold">LOGIN</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
  console.log('✅ Header 로드 성공')
</script>

<style scoped>
</style>