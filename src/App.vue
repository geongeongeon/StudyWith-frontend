<script setup>
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Header />

    <main class="d-flex flex-fill">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
</style>
