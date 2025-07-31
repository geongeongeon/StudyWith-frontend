<template>
  <div class="container d-flex">
    <aside class="border-end p-3">
      <ul class="nav flex-column">
        <li class="nav-item p-3" :class="{ active: activeMenu === 'STUDY' }" @click="activeMenu = 'STUDY'">내 스터디</li>
        <li class="nav-item p-3" :class="{ active: activeMenu === 'PROFILE' }" @click="activeMenu = 'PROFILE'">회원 정보</li>
        <li class="nav-item p-3" :class="{ active: activeMenu === 'DELETE' }" @click="activeMenu = 'DELETE'">회원 탈퇴 </li>
      </ul>
    </aside>

    <div class="bg-light p-3 flex-grow-1" v-if="activeMenu === 'PROFILE'">
      <MemberProfilePage />
    </div>
    <div class="bg-light p-3 flex-grow-1" v-if="activeMenu === 'STUDY'">
      <MemberStudyPage />
    </div>
    <div class="bg-light p-3 flex-grow-1" v-if="activeMenu === 'DELETE'">
      <MemberDeletePage />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import MemberProfilePage from './MemberProfilePage.vue'
  import MemberStudyPage from './MemberStudyPage.vue';
  import MemberDeletePage from './MemberDeletePage.vue';

  const activeMenu = ref('STUDY')
</script>

<style scoped>
  aside > ul > li {
    transition: background-color 0.2s ease;
  }

  aside > ul > li:hover {
    cursor: pointer;
  }

  .nav-item.active {
    color: white;
    background-color: black;
  }
</style>