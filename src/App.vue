<template>
  <div class="d-flex flex-column min-vh-100">
    <customAlert :show="alertStore.show" :contant="alertStore.contant" @closeAlert="closeAlert" />

    <Header />

    <main class="d-flex flex-fill">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'
  import customAlert from './components/CustomAlert.vue'
  import { useAlertStore } from './stores/alertStore'
  
  const alertStore = useAlertStore()

  const closeAlert = () => {
    alertStore.closeAlert()
  }
</script>


<style scoped>
</style>
