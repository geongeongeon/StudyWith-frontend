<template>
  <div class="container d-flex">
    <aside class="border-end p-3">
      <ul class="nav flex-column">
        <li class="nav-item p-3" :class="{ active: activeMenu === 'PROFILE' }" @click="activeMenu = 'PROFILE'">PROFILE</li>
        <li class="nav-item p-3" :class="{ active: activeMenu === 'STUDY' }" @click="activeMenu = 'STUDY'">STUDY</li>
        <li class="nav-item p-3" :class="{ active: activeMenu === 'DELETE' }" @click="activeMenu = 'DELETE'">DELETE</li>
      </ul>
    </aside>

    <div class="bg-light p-3 flex-grow-1" v-if="activeMenu === 'PROFILE'">
      <ProfilePage />
    </div>
    <div class="bg-light p-3 flex-grow-1" v-if="activeMenu === 'STUDY'">
      <StudyPage />
    </div>
    <div class="bg-light p-3 flex-grow-1" v-if="activeMenu === 'DELETE'">
      <DeletePage />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import ProfilePage from './ProfilePage.vue'
  import StudyPage from './StudyPage.vue';
  import DeletePage from './DeletePage.vue';

  const activeMenu = ref('PROFILE')
</script>

<style scoped>
  aside > ul > li {
    transition: background-color 0.2s ease;
  }

  aside > ul > li:hover {
    background-color: #dededf;
    cursor: pointer;
  }

  .nav-item.active {
    color: white;
    background-color: black;
  }
</style>